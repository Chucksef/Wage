import "./index.scss";

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

const TEMPLATES = {
	entries: {
		client: `
			<div class="data-block first-block">
				<h3>%name</h1>
			</div>
			<div class="data-block">
				<p>%lastClockedIn</p>
				<p>%active</p>
			</div>
			<div class="data-block">
				<p>%hourlyRate</p>
				<p>%totalHours</p>
			</div>	
		`,
		project: `
			<div class="data-block first-block">
				<h4>%name</h1>
				<h5>%clientName</h2>
			</div>
			<div class="data-block">
				<p>%lastClockedIn</p>
				<p>%active</p>
			</div>
			<div class="data-block">
				<p>%hourlyRate</p>
				<p>%totalHours</p>
			</div>
		`,
	},
};

class UserApp {
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
		db.collection("Clients").where("User_id", "==", user_id).get().then((clients_snap) => {
			// load all docs in Sessions collection into a sessions{} object
			clients_snap.docs.forEach((client) => {
				this.clients[`${client.id}`] = new Client(client.data());
			});

			// now that all CPS are loaded, display clients...
			UI.display(this.clients, TEMPLATES.entries.client);

			// now load projects sequentially...
			this.loadProjects(this.user_id);
		});
	}

	// load all FireStore user projects into a projects{} object
	loadProjects(user_id) {
		db.collection("Projects").where("User_id", "==", user_id).get().then((projects_snap) => {
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
		db.collection("Sessions").where("User_id", "==", user_id).get().then((sessions_snap) => {
			// load all docs in Sessions collection into a sessions{} object
			sessions_snap.docs.forEach((session) => {
				this.sessions[`${session.id}`] = new Session(session.data());
			});
		});
	}

	/*static calculateWages(rate, sessions) {
		sessions.forEach((sess) => {
			let dur = sess.clock_out - sess.clock_in;

		}
	}*/
}

class Client {
	constructor(client) {
		this.client_id = client.Client_ID;
		this.name = client.Name;
		this.address = client.Address;
		this.city = client.City;
		this.state = client.State;
		this.country = client.Country;
		this.zip = client.Zip;
		this.phone = client.Phone;
		this.email = client.Email;
		this.contact_name = client.Contact_name;
		this.invoice_frequency = client.Invoice_frequency;
		this.notes = client.Notes;
		this.rate = client.Rate;
		this.active = client.Active;
		this.lastClockedIn = client.Last_Clocked_In;
		this.totalHours = client.Total_Hours;
		this.totalWages = client.Total_Wages;
	}
}

class Project {
	constructor(project) {
		this.client_id = project.Client_ID;
		this.user_id = project.User_ID;
		this.name = project.Name;
		this.description = project.Description;
		this.rate = project.Rate;
		this.due_date = project.Due_Date;
		this.active = project.Active;
		this.lastClockedIn = project.Last_Clocked_In;
		this.totalHours = project.Total_Hours;
		this.totalWages = project.Total_Wages;
	}
}

class Session {
	constructor(session) {
		this.user_id = session.User_ID;
		this.project_id = session.Project_ID;
		this.clock_in = session.Clock_In;
		this.clock_out = session.Clock_Out;
		this.breaks = session.Breaks;
		this.rate = session.Rate;
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

	static display(data, template) {
		UI.clear();

		Object.keys(data).forEach((key) => {
			let current = data[key];
			let entry = document.createElement("div");
			entry.classList.add("entry");
			entry.id = key;

			entry.innerHTML = template
				.replace(/%name/g, current.name)
				.replace(/%hourlyRate/g, `$${current.rate} / hr`)
				.replace(/%lastClockedIn/g, current.lastClockedIn)
				.replace(/%active/g, current.active)
				.replace(/%totalHours/g, current.totalHours);

			UI.addEntry(entry);
		});
	}
}

let app = new UserApp("chucksef@gmail.com");

/* SAVED

// replace relevant lines...


// append session to the UI
UI.addSession(entry);



*/
