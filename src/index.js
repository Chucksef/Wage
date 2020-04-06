import "./index.scss";
import { TEMPLATES } from "./js/template.js";
import { Hash64 } from "./js/hash64.js";
import { Client } from "./js/client.js";
import { Project } from "./js/project.js";
import { Session } from "./js/session.js";
import { UI } from "./js/ui.js";
import { firebaseConfig } from "./js/firebase.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const DOM = {
	body: document.querySelector("body"),
	readout: document.querySelector("#readout"),
	controls: document.querySelector("#controls"),
	sidebar: document.querySelector("#sidebar"),
	timer: document.querySelector("#timer"),

	filters: document.querySelector("#filters"),
	btn_Clients: document.querySelector("#btn-clients"),
	btn_Projects: document.querySelector("#btn-Projects"),
	btn_Sessions: document.querySelector("#btn-Sessions"),

	btn_NewClient: document.querySelector("#btn-NewClient"),
	btn_NewProject: document.querySelector("#btn-NewProject"),
};

class App {
	constructor(email) {
		this.clients = {};
		this.projects = {};
		this.sessions = {};
		this.activeSession = null;
		this.getUserData(email); //    <-------------------------------------------------------------------- DB INIT
		UI.setUpEventListeners(this);
	}

	getUserData(email) {
		// look up user by email, return userID
		db.collection("Users").where("Email", "==", email).get().then((usersSnap) => {
			usersSnap.docs.forEach((user) => {
				this.userID = user.id;

				// Now use this user ID to load all CPS (Clients Projects Sessions) from the FireStore;
				this.loadClients(this.userID);
			});
		});
	}

	// load all FireStore user clients into a clients{} object
	loadClients(userID) {
		db.collection("Clients").where("User_ID", "==", userID).get().then((clientsSnap) => {
			// load all docs in Sessions collection into a sessions{} object
			clientsSnap.docs.forEach((client) => {
				this.clients[`${client.id}`] = new Client(client.data());
			});

			// now load projects sequentially...
			this.loadProjects(this.userID);
		});
	}

	// load all FireStore user projects into a projects{} object
	loadProjects(userID) {
		db.collection("Projects").where("User_ID", "==", userID).get().then((projectsSnap) => {
			// load all docs in Sessions collection into a sessions{} object
			projectsSnap.docs.forEach((project) => {
				this.projects[`${project.id}`] = new Project(project.data());
			});

			// now load sessions sequentially...
			this.loadSessions(this.userID);
		});
	}

	// load all FireStore user sessions into a sessions{} object
	loadSessions(userID) {
		db.collection("Sessions").where("User_ID", "==", userID).get().then((sessionsSnap) => {
			// load all docs in Sessions collection into a sessions{} object
			sessionsSnap.docs.forEach((session) => {
				this.sessions[`${session.id}`] = new Session(session.data());
			});

			// now that all CPS are loaded, calculate all derived properties...
			this.deriveProperties();

			// and then display a list of clients as default...
			UI.display(this, this.clients);
			DOM.btn_Clients.classList.add("selected");
		});
	}

	getLastDate(entry) {
		// set up initial arrays of each object type's keys for checking...
		let clientKeys = Object.keys(this.clients);
		let projectKeys = Object.keys(this.projects);
		let sessionKeys = Object.keys(this.sessions);

		// check if entry is a client...
		if (clientKeys.includes(entry.id)) {
			// It is! Now build an object with all projects whose clientID matches the client's key
			let clientProjects = {};
			projectKeys.forEach((key) => {
				let proj = this.projects[key]; // grab each project and check if it's the client's key
				if (proj.clientID == entry.id) {
					clientProjects[key] = proj; // add it to clientProjects
				}
			});

			// set up a new array of all valid project keys for the client in question
			let clientProjectKeys = Object.keys(clientProjects);

			// Great! Now build an array with all clock-out times of sessions that are a part of relevant projects
			let projectSessions = [];
			sessionKeys.forEach((key) => {
				let sess = this.sessions[key];
				if (clientProjectKeys.includes(sess.projectID)) {
					projectSessions.push(sess.clockOut);
				}
			});

			// Neat!
			let highestVal = 0;
			let ts;

			// iterate through all the values in projectSessions...
			for (let x of projectSessions) {
				if (x == null) {
					continue;
				}
				if (x.seconds > highestVal) {
					highestVal = x.seconds;
					ts = x;
				}
			}

			return ts;
		} else if (projectKeys.includes(entry.id)) {
			let projectSessions = [];
			sessionKeys.forEach((key) => {
				let sess = this.sessions[key];
				if (sess.projectID == entry.id) {
					projectSessions.push(sess.clockOut);
				}
			});

			// Neat!
			let highestVal = 0;
			let timestamp;

			// iterate through all the values in projectSessions...
			for (let x of projectSessions) {
				if (x == null) {
					continue;
				}
				if (x.seconds > highestVal) {
					highestVal = x.seconds;
					timestamp = x;
				}
			}

			return timestamp;
		} else {
			return this.sessions[entry.id].clockOut;
		}
	}

	deriveProperties() {
		/* 
			deriveProperties() will iterate through all data tied to a user
			and assign, process, and pull out any needed values, allowing
			the rest of the app to function as expected
		*/

		// set up initial arrays of each object type's keys for checking...
		this.clientKeys = Object.keys(this.clients);
		this.projectKeys = Object.keys(this.projects);
		this.sessionKeys = Object.keys(this.sessions);

		// Take each client one at a time ...
		this.clientKeys.forEach((cKey) => {
			let currentClient = this.clients[cKey];
			let clientName = currentClient.name;
			currentClient.totalHours = 0;
			currentClient.totalWages = 0;
			currentClient.type = "client";
			currentClient.template = TEMPLATES.entries.client;
			currentClient.id = cKey;

			// build an array of the client's projects
			let clientProjects = [];
			this.projectKeys.forEach((pKey) => {
				if (this.projects[pKey].clientID == cKey) {
					clientProjects.push(pKey);
				}
			});

			// add an array of all project to keys to each client
			currentClient.projectKeys = clientProjects;

			// store the projects' total wages and hours for use by the client eventually
			let projectsHours = 0;
			let projectsWages = 0;

			// take each of the client's projects ...
			clientProjects.forEach((pKey) => {
				let currentProject = this.projects[pKey];
				let projectName = currentProject.name;
				if (currentProject.rate == "") {
					currentProject.rate = currentClient.rate;
				}
				currentProject.clientName = clientName;
				currentProject.type = "project";
				currentProject.template = TEMPLATES.entries.project;
				currentProject.id = pKey;
				currentProject.totalHours = 0;
				currentProject.totalWages = 0;

				// build an array of the project's sessions
				let projectSessions = [];
				this.sessionKeys.forEach((sKey) => {
					if (this.sessions[sKey].projectID == pKey) {
						projectSessions.push(sKey);
					}
				});

				currentProject.sessionKeys = projectSessions;

				// store the sessions' total hours for use by the project eventually
				let sessionsHours = 0;
				// take each session associated with ^ ...
				projectSessions.forEach((sKey) => {
					let currentSession = this.sessions[sKey];
					// assign the active session if clockOut is null
					if (currentSession.clockOut == null) {
						this.activeSession = sKey;
						UI.showClock(this, this.sessions[sKey]);
					}
					currentSession.clientName = clientName;
					currentSession.projectName = projectName;
					currentSession.type = "session";
					currentSession.template = TEMPLATES.entries.session;
					currentSession.id = sKey;
					currentSession.duration =
						this.getDuration(currentSession.clockOut, currentSession.clockIn) - currentSession.breaks;

					// add the current session's duration to the sessions' total hours
					sessionsHours += currentSession.duration;
				});

				currentProject.totalHours += sessionsHours; // add the sessions' total hours to the current project's total hours
				projectsHours += currentProject.totalHours; // add the project's total hours to the projects' total hours
				projectsWages += currentProject.totalHours * currentProject.rate;
			});
			//assign client.totalHours
			currentClient.totalHours += projectsHours;
			currentClient.totalWages += projectsWages;
		});
		// next client ...
	}

	getDuration(clockOut, clockIn) {
		if (clockOut != null) {
			return Math.floor((clockOut.seconds - clockIn.seconds) / 60) / 60; // rounds down to the minute, then returns fraction of hour (eliminates the need to worry about seconds)
		} else {
			return 0;
		}
	}

	addClient(client) {
		client.userID = this.userID;

		// generate new hash for ID
		let clientID = Hash64.gen(30);

		// add client to clients{}
		this.clients[clientID] = client;

		// save to FireStore
		db.collection("Clients").doc(clientID).set({
			Address: client.address,
			City: client.city,
			Contact: client.contactName,
			Country: client.country,
			Email: client.email,
			Invoice_Frequency: client.invoiceFrequency,
			Name: client.name,
			Notes: client.notes,
			Phone: client.phone,
			Rate: client.rate,
			State: client.state,
			User_ID: this.userID,
			Zip: client.zip,
		});
	}

	addProject(project) {
		project.userID = this.userID;
		// generate new hash for ID
		let projectID = Hash64.gen(30);

		// add client to projects{}
		this.projects[projectID] = project;

		// save to FireStore
		db.collection("Projects").doc(projectID).set({
			Name: project.name,
			Description: project.description,
			Rate: project.rate,
			User_ID: this.userID,
			Client_ID: project.clientID,
		});
	}

	getObject(id) {
		// takes an ID string and returns the object associated with it
		// check all of app's cps key arrays for the element's ID...
		if (this.clientKeys.includes(id)) {
			// the element was a client. Return it.
			return this.clients[id];
		} else if (this.projectKeys.includes(id)) {
			// the element was a project. Return it.
			return this.projects[id];
		} else if (this.sessionKeys.includes(id)) {
			// the element was a session. Return it.
			return this.sessions[id];
		}

		return null;
	}

	getChildren(object) {
		// takes a single object and returns an array of child keys
		if (object.type == "client") {
			return object.projectKeys;
		} else if (object.type == "project") {
			return object.sessionKeys;
		} else {
			return [];
		}
	}

	clockIn(id) {
		// check if already clocked in
		if (this.activeSession != null) {
			alert("already clocked in.\n\nPlease clock out of your current project and try again.");
		} else {
			// 1) generate session
			let activeProject = this.getObject(id);
			let tempSession = {
				Breaks: 0,
				Clock_In: firebase.firestore.Timestamp.now(),
				Clock_Out: null,
				Project_ID: activeProject.id,
				User_ID: this.userID,
			};

			// 2) save session to model
			let hash = Hash64.gen(30); // use Hash64 generate a new hash for the session
			this.activeSession = hash;
			this.sessions[hash] = new Session(tempSession);
			this.sessions[hash].template = TEMPLATES.entries.session;
			this.sessions[hash].id = hash;

			// 3) save session to db
			db.collection("Sessions").doc(hash).set({
				Breaks: tempSession.Breaks,
				Clock_In: tempSession.Clock_In,
				Clock_Out: tempSession.Clock_Out,
				Project_ID: tempSession.Project_ID,
				User_ID: tempSession.User_ID,
			});

			// 4) display running clock
			UI.showClock(this, this.sessions[hash]);
		}
	}

	clockOut(id) {
		// stop the timer
		clearInterval(this.timer);
		this.activeSession = null;

		// write to the db creating a timestamp for the Clock_Out property
		db.collection("Sessions").doc(id).update({
			Clock_Out: firebase.firestore.Timestamp.now(),
		});

		UI.hideClock();
	}
}

let main = new App("chucksef@gmail.com");

export { DOM };
