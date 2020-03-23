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
				<h3>Client Name</h1>
			</div>
			<div class="data-block">
				<p>Last Clocked In</p>
				<p>Active?</p>
			</div>
			<div class="data-block">
				<p>Hourly Rate</p>
				<p>Total Hours</p>
			</div>	
		`,
	},
};

class Readout {
	constructor() {}

	static addEntry(entry) {
		DOM.readout.appendChild(entry);
	}

	static clear() {
		DOM.readout.innerHTML = "";
	}
}

let client = document.createElement("div");
client.classList.add("entry");
client.innerHTML = TEMPLATES.entries.client;

Readout.clear();
Readout.addEntry(client);
