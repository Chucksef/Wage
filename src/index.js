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
};

const TEMPLATES = {
	entries: {
		client: `
			<div class="data-block first-block">
				<h3>%clientName</h1>
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
				<h4>Project Name</h1>
				<h5>Client Name</h2>
			</div>
			<div class="data-block">
				<p>Last Clocked In</p>
				<p>Completed?</p>
			</div>
			<div class="data-block">
				<p>Hourly Rate</p>
				<p>Total Hours</p>
			</div>
		`,
	},
};

class Client {
	constructor(client) {
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
	}
}

class Project {
	constructor(project) {
		this.name = project.Name;
		this.description = project.Description;
		this.rate = project.Rate;
		this.client_id = project.Client_id;
		this.completed = project.Completed;
		this.due_date = project.Due_date;
	}
}

class Session {
	constructor(session) {
		this.session_id = session.Session_id;
		this.clock_in = session.Clock_in;
		this.clock_out = session.Clock_out;
		this.breaks = session.Breaks;
	}
}

class Readout {
	static addClient(entry) {
		//add element to DOM
		DOM.readout.appendChild(entry);
	}

	static clear() {
		DOM.readout.innerHTML = "";
	}
}

function loadDB() {
	Readout.clear();

	let clients = {};

	db.collection("Clients").get().then((client_snap) => {
		client_snap.docs.forEach((client) => {
			clients[`${client.id}`] = client.data();
		});

		Object.keys(clients).forEach((key) => {
			let client = new Client(clients[key]);
			let entry = document.createElement("div");
			entry.classList.add("entry");

			//replace relevant lines...
			entry.innerHTML = TEMPLATES.entries.client
				.replace(/%clientName/g, client.name)
				.replace(/%hourlyRate/g, `$${client.rate} / hr`);
			Readout.addClient(entry);
		});
	});
}

loadDB();
