import "./index.scss";
import { TEMPLATES } from "./templates.js";

let firebaseConfig = {
	apiKey: "AIzaSyBCblfryZE9C1r2opb9PdzF4o1oK8lDiNM",
	authDomain: "wage-4e0dd.firebaseapp.com",
	databaseURL: "https://wage-4e0dd.firebaseio.com",
	projectId: "wage-4e0dd",
	storageBucket: "wage-4e0dd.appspot.com",
	messagingSenderId: "280481970592",
	appId: "1:280481970592:web:8fcbb2f23712d39f7dccc5",
	measurementId: "G-EH5YQD64YP",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

const DOM = {
	body: document.querySelector("body"),
	readout: document.querySelector("#readout"),
	controls: document.querySelector("#controls"),

	filters: document.querySelector("#filters"),

	btn_Clients: document.querySelector("#btn-Clients"),
	btn_Projects: document.querySelector("#btn-Projects"),
	btn_Sessions: document.querySelector("#btn-Sessions"),
	btn_NewClient: document.querySelector("#btn-NewClient"),
	btn_NewProject: document.querySelector("#btn-NewProject"),
};

class Client {
	constructor(client) {
		this.address = client.Address;
		this.city = client.City;
		this.contactName = client.Contact;
		this.country = client.Country;
		this.email = client.Email;
		this.invoiceFrequency = client.Invoice_Frequency;
		this.name = client.Name;
		this.notes = client.Notes;
		this.phone = client.Phone;
		this.rate = client.Rate;
		this.state = client.State;
		this.zip = client.Zip;
	}
}

class Project {
	constructor(project) {
		this.clientID = project.Client_ID;
		this.description = project.Description;
		this.name = project.Name;
		this.rate = project.Rate;
		this.userID = project.User_ID;
	}
}

class Session {
	constructor(session) {
		this.breaks = session.Breaks;
		this.clockIn = session.Clock_In;
		this.clockOut = session.Clock_Out;
		this.projectID = session.Project_ID;
		this.userID = session.User_ID;
	}
}

class App {
	constructor(email) {
		this.clients = {};
		this.projects = {};
		this.sessions = {};
		this.getUserData(email);
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
			UI.display(this, this.clients, TEMPLATES.entries.client);
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
				if (x.seconds > highestVal) {
					highestVal = x.seconds;
					ts = x;
				}
			}

			return ts;
		}
		else if (projectKeys.includes(entry.id)) {
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
				if (x.seconds > highestVal) {
					highestVal = x.seconds;
					timestamp = x;
				}
			}

			return timestamp;
		}
		else {
			return this.sessions[entry.id].clockOut;
		}
	}

	deriveProperties() {
		// set up initial arrays of each object type's keys for checking...
		let clientKeys = Object.keys(this.clients);
		let projectKeys = Object.keys(this.projects);
		let sessionKeys = Object.keys(this.sessions);

		// Take each client one at a time ...
		clientKeys.forEach((cKey) => {
			let currentClient = this.clients[cKey];
			let clientName = currentClient.name;
			currentClient.totalHours = 0;
			currentClient.totalWages = 0;

			// build an array of the client's projects
			let clientProjects = [];
			projectKeys.forEach((pKey) => {
				if (this.projects[pKey].clientID == cKey) {
					clientProjects.push(pKey);
				}
			});

			// store the projects' total wages and hours for use by the client eventually
			let projectsHours = 0;
			let projectsWages = 0;
			// take each of the client's projects ...
			clientProjects.forEach((pKey) => {
				let currentProject = this.projects[pKey];
				let projectName = currentProject.name;
				currentProject.clientName = clientName;
				currentProject.totalHours = 0;
				currentProject.totalWages = 0;

				// build an array of the project's sessions
				let projectSessions = [];
				sessionKeys.forEach((sKey) => {
					if (this.sessions[sKey].projectID == pKey) {
						projectSessions.push(sKey);
					}
				});

				// store the sessions' total hours for use by the project eventually
				let sessionsHours = 0;
				// take each session associated with ^ ...
				projectSessions.forEach((sKey) => {
					let currentSession = this.sessions[sKey];
					currentSession.clientName = clientName;
					currentSession.projectName = projectName;
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
		return Math.floor((clockOut.seconds - clockIn.seconds) / 60) / 60; // rounds down to the minute, then returns fraction of hour (eliminates the need to worry about seconds)
	}

	addClient(client) {
		// save to FireStore
		// get FireStore's ID
		// add client to clients{}
		// UI.display
	}
}

class UI {
	static addEntry(entry) {
		//add element to DOM
		DOM.readout.appendChild(entry);
	}

	static clear() {
		let menu = document.querySelector("#modal");
		if (menu) {
			menu.remove();
		}
		DOM.readout.innerHTML = "";
	}

	static display(app, data, template) {
		UI.clear();

		Object.keys(data).forEach((key) => {
			let current = data[key];
			let entry = document.createElement("div");
			entry.classList.add("entry");
			entry.id = key;
			current.id = key;

			// replace fields in template with corresponding data
			entry.innerHTML = Format.template(app, current, template);

			UI.addEntry(entry);
		});
	}

	static menu(app, template) {
		let menu = document.createElement("div");
		menu.id = "modal";
		menu.innerHTML = template;

		DOM.body.insertAdjacentElement("beforeend", menu);
		document.querySelector("#submit").addEventListener("click", () => {
			// validate fields are filled out
			// build new Client object
			// pass the object to save it
			// app.saveClient()
			UI.display(app, app.clients, TEMPLATES.entries.client);
		});
	}

	static setUpEventListeners(app) {
		DOM.filters.addEventListener("click", function(e) {
			let target = e.target;
			let buttons = DOM.filters.querySelectorAll("button");
			buttons.forEach((button) => {
				button.classList.remove("selected");
			});
			target.classList.add("selected");
		});

		// Add Main Control Event Listeners
		DOM.btn_NewClient.addEventListener("click", function() {
			UI.menu(app, TEMPLATES.menus.client);
		});
		DOM.btn_NewProject.addEventListener("click", function() {
			UI.menu(app, TEMPLATES.menus.project);
		});

		// Add Filter Event Listeners
		DOM.btn_Clients.addEventListener("click", function() {
			UI.clear();
			UI.display(app, app.clients, TEMPLATES.entries.client);
		});
		DOM.btn_Projects.addEventListener("click", function() {
			UI.clear();
			UI.display(app, app.projects, TEMPLATES.entries.project);
		});
		DOM.btn_Sessions.addEventListener("click", function() {
			UI.clear();
			UI.display(app, app.sessions, TEMPLATES.entries.session);
		});
	}
}

class Format {
	static dollars(num) {
		let split = num.toString().split(".");
		if (split.length == 1) {
			return `$${num}.00`;
		}
		else {
			let oldPrefix = split[0];
			let newPrefix = "";
			for (let i = oldPrefix.length - 1, j = 1; i >= 0; i--, j++) {
				// append first
				newPrefix = `${oldPrefix[i]}${newPrefix}`;
				// if idx/3 gives no remainder, append a comma...
				if (j % 3 == 0 && i != 0) {
					newPrefix = `,${newPrefix}`;
				}
			}
			return `$${newPrefix}.${(split[1] + "00").substr(0, 2)}`;
		}
	}

	static date(timestamp) {
		let date = timestamp.toDate().toString().split(" ");
		return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
	}

	static time(timestamp) {
		let time = timestamp.toDate().toString().split(" ")[4].split(":");
		let hours = parseInt(time[0]);
		let minutes = time[1];
		let ampm = "AM";

		if (hours > 11) {
			ampm = "PM";
		}
		if (hours > 12) {
			hours = hours - 12;
		}

		return `${hours}:${minutes} ${ampm}`;
	}

	static template(app, data, temp) {
		if (temp.includes("%name")) {
			temp = temp.replace(/%name/g, data.name);
		}
		if (temp.includes("%clientName")) {
			temp = temp.replace(/%clientName/g, data.clientName);
		}
		if (temp.includes("%projectName")) {
			temp = temp.replace(/%projectName/g, data.projectName);
		}
		if (temp.includes("%lastClockedIn")) {
			temp = temp.replace(/%lastClockedIn/g, Format.date(app.getLastDate(data)));
		}
		if (temp.includes("%rate")) {
			temp = temp.replace(/%rate/g, `${Format.dollars(data.rate)} / hr`);
		}
		if (temp.includes("%totalHours")) {
			temp = temp.replace(/%totalHours/g, `${data.totalHours} hours`);
		}
		if (temp.includes("%duration")) {
			temp = temp.replace(/%duration/g, `${data.duration} hours`);
		}
		if (temp.includes("%date")) {
			temp = temp.replace(/%date/g, Format.date(data.clockOut));
		}
		if (temp.includes("%clockIn")) {
			temp = temp.replace(/%clockIn/g, Format.time(data.clockIn));
		}
		if (temp.includes("%clockOut")) {
			temp = temp.replace(/%clockOut/g, Format.time(data.clockOut));
		}

		return temp;
	}
}

let main = new App("chucksef@gmail.com");
