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
	readout: document.querySelector("#display"),
	controls: document.querySelector("#controls"),
};

class App {
	constructor(email) {
		this.clients = {};
		this.projects = {};
		this.sessions = {};
		this.getUserData(email);
	}

	getUserData(email) {
		// look up user by email, return user_id
		db.collection("Users").where("Email", "==", email).get().then((users_snap) => {
			users_snap.docs.forEach((user) => {
				this.user_id = user.id;

				// Now use this user ID to load all CPS (Clients Projects Sessions) from the FireStore;
				this.loadClients(this.user_id);
			});
		});
	}

	// load all FireStore user clients into a clients{} object
	loadClients(user_id) {
		db.collection("Clients").where("User_ID", "==", user_id).get().then((clients_snap) => {
			// load all docs in Sessions collection into a sessions{} object
			clients_snap.docs.forEach((client) => {
				this.clients[`${client.id}`] = new Client(client.data());
			});

			// now load projects sequentially...
			this.loadProjects(this.user_id);
		});
	}

	// load all FireStore user projects into a projects{} object
	loadProjects(user_id) {
		db.collection("Projects").where("User_ID", "==", user_id).get().then((projects_snap) => {
			// load all docs in Sessions collection into a sessions{} object
			projects_snap.docs.forEach((project) => {
				this.projects[`${project.id}`] = new Project(project.data());
			});

			// now load sessions sequentially...
			this.loadSessions(this.user_id);
		});
	}

	// load all FireStore user sessions into a sessions{} object
	loadSessions(user_id) {
		db.collection("Sessions").where("User_ID", "==", user_id).get().then((sessions_snap) => {
			// load all docs in Sessions collection into a sessions{} object
			sessions_snap.docs.forEach((session) => {
				this.sessions[`${session.id}`] = new Session(session.data());
			});

			// now that all CPS are loaded, display clients...
			UI.display(this, this.clients, TEMPLATES.client);
		});
	}

	getLastDate(entry) {
		// set up initial arrays of each object type's keys for checking...
		let client_keys = Object.keys(this.clients);
		let project_keys = Object.keys(this.projects);
		let session_keys = Object.keys(this.sessions);

		// check if entry is a client...
		if (client_keys.includes(entry.id)) {
			// It is! Now build an object with all projects whose client_id matches the client's key
			let client_projects = {};
			project_keys.forEach((key) => {
				let proj = this.projects[key]; // grab each project and check if it's the client's key
				if (proj.client_id == entry.id) {
					client_projects[key] = proj; // add it to client_projects
				}
			});

			// set up a new array of all valid project keys for the client in question
			let client_project_keys = Object.keys(client_projects);

			// Great! Now build an array with all clock-out times of sessions that are a part of relevant projects
			let project_sessions = [];
			session_keys.forEach((key) => {
				let sess = this.sessions[key];
				if (client_project_keys.includes(sess.project_id)) {
					project_sessions.push(sess.clock_out);
				}
			});

			// Neat!
			let highestVal = 0;
			let ts;

			// iterate through all the values in project_sessions...
			for (let x of project_sessions) {
				if (x.seconds > highestVal) {
					highestVal = x.seconds;
					ts = x;
				}
			}

			return ts;
		}
		else if (project_keys.includes(entry.id)) {
			let project_sessions = [];
			session_keys.forEach((key) => {
				let sess = this.sessions[key];
				if (sess.project_id == entry.id) {
					project_sessions.push(sess.clock_out);
				}
			});

			// Neat!
			let highestVal = 0;
			let timestamp;

			// iterate through all the values in project_sessions...
			for (let x of project_sessions) {
				if (x.seconds > highestVal) {
					highestVal = x.seconds;
					timestamp = x;
				}
			}

			return timestamp;
		}
		else {
			return entry.clock_out;
		}
	}
}

class Client {
	constructor(client) {
		this.active = client.Active;
		this.address = client.Address;
		this.city = client.City;
		this.contact_name = client.Contact;
		this.country = client.Country;
		this.email = client.Email;
		this.invoice_frequency = client.Invoice_Frequency;
		this.lastClockedIn = client.Last_Clocked_In;
		this.name = client.Name;
		this.notes = client.Notes;
		this.phone = client.Phone;
		this.rate = client.Rate;
		this.state = client.State;
		this.totalHours = client.Total_Hours;
		this.totalWages = client.Total_Wages;
		this.zip = client.Zip;
	}
}

class Project {
	constructor(project) {
		this.active = project.Active;
		this.client_id = project.Client_ID;
		this.description = project.Description;
		this.due_date = project.Due_Date;
		this.lastClockedIn = project.Last_Clocked_In;
		this.name = project.Name;
		this.rate = project.Rate;
		this.totalHours = project.Total_Hours;
		this.totalWages = project.Total_Wages;
		this.user_id = project.User_ID;
	}
}

class Session {
	constructor(session) {
		this.breaks = session.Breaks;
		this.clock_in = session.Clock_In;
		this.clock_out = session.Clock_Out;
		this.project_id = session.Project_ID;
		this.rate = session.Rate;
		this.user_id = session.User_ID;
	}
}

class UI {
	static addEntry(entry) {
		//add element to DOM
		DOM.readout.appendChild(entry);
	}

	static clear() {
		DOM.readout.innerHTML = "";
	}

	static display(app, data, template) {
		UI.clear();

		Object.keys(data).forEach((key) => {
			let current = data[key];
			let entry = document.createElement("div");
			entry.classList.add("entry");
			entry.id = key;

			entry.innerHTML = template
				.replace(/%name/g, current.name)
				.replace(/%lastClockedIn/g, Format.date(app.getLastDate(entry)))
				.replace(/%active/g, current.active)
				.replace(/%hourlyRate/g, `${Format.dollars(current.rate)} / hr`)
				.replace(/%totalHours/g, `${current.totalHours} hours`);

			UI.addEntry(entry);
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

	static date(ts) {
		let date = ts.toDate().toString().split(" ");
		return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
	}
}

let main = new App("chucksef@gmail.com");
