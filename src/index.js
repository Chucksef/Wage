import "./index.scss";
import { TEMPLATES } from "./templates.js";
import { Hash64 } from "./hash64.js";

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

	validate() {
		let errors = [];
		let email = this.email.match(/\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/)[0];

		if (this.name == "") {
			errors.push("Client Name Cannot be Blank");
		}

		if (this.rate == "" || parseFloat(this.rate) == NaN) {
			errors.push("Rate Must be a Valid Number");
		}

		if (this.contactName == "") {
			errors.push("Must Include a Contact Name");
		}

		if (email.length < 6) {
			errors.push("Must Include a Valid Contact Email Address");
		}

		if (this.invoiceFrequency == "") {
			errors.push("Must Choose the Invoicing Frequency");
		}

		return errors;
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

	validate() {
		let errors = [];

		if (this.name == "") {
			errors.push("Project Name Cannot be Blank");
		}

		if (this.clientID == "") {
			errors.push("Please Select a Client");
		}

		return errors;
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
		return Math.floor((clockOut.seconds - clockIn.seconds) / 60) / 60; // rounds down to the minute, then returns fraction of hour (eliminates the need to worry about seconds)
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
		}
		else if (this.projectKeys.includes(id)) {
			// the element was a project. Return it.
			return this.projects[id];
		}
		else if (this.sessionKeys.includes(id)) {
			// the element was a session. Return it.
			return this.sessions[id];
		}

		return null;
	}

	getChildren(object) {
		// takes a single object and returns an array of child keys
		if (object.type == "client") {
			return object.projectKeys;
		}
		else if (object.type == "project") {
			return object.sessionKeys;
		}
		else {
			return [];
		}
	}
}

class UI {
	static addEntry(app, entry, destination) {
		// add event listener to each entry)
		if (entry.type != "session") {
			entry.addEventListener("click", () => {
				let object = app.getObject(entry.id);
				UI.toggleExpand(app, entry, object);
			});
		}

		// add element to DOM
		destination.appendChild(entry);
	}

	static toggleExpand(app, target, object) {
		// get all selected elements on the whole document
		let allSelecteds = document.querySelectorAll(".expanded");
		allSelecteds.forEach((elem) => {
			if (elem.type == target.type && elem != target) {
				// animate the drawer closing
				Animator.collapse(elem.nextSibling, 0.15);

				// de-select all elements matching clicked element's type
				elem.classList.toggle("expanded");
			}
		});

		// toggle expanded class of target
		target.classList.toggle("expanded");
		// if target is expanded...
		if (target.classList.contains("expanded")) {
			// create a new element with class="childContainer"
			let childContainer = document.createElement("div");
			if (object.type == "client") {
				childContainer.classList.add("childProjects");
			}
			else if (object.type == "project") {
				childContainer.classList.add("childSessions");
			}

			// place childContainer AFTER END of the expanded target
			target.insertAdjacentElement("afterend", childContainer);

			// fill childContainer with children
			let children = app.getChildren(object);
			UI.showChildren(app, children, childContainer);
			Animator.expand(childContainer, 0.2);
		}
		else {
			// if it's not expanded, remove all children shit
			Animator.collapse(target.nextSibling, 0.2);
		}
	}

	static showChildren(app, children, destination) {
		children.forEach((childKey) => {
			// grab the data for this object key
			let childObj = app.getObject(childKey);
			// create a new element to append later
			let childElem = document.createElement("div");
			childElem.id = childKey;
			childElem.type = childObj.type;
			childElem.classList.add("entry");

			// use the child Object to generate the element's HTML
			childElem.innerHTML = Format.template(app, childObj);

			UI.addEntry(app, childElem, destination);
		});
	}

	static reset() {
		// get and clear any menus
		let menu = document.querySelector("#modal");
		if (menu) {
			menu.remove();
		}

		//clear filter button selection
		let buttons = DOM.filters.querySelectorAll("button");

		buttons.forEach((button) => {
			button.classList.remove("selected");
		});

		// clear the actual readout
		DOM.readout.innerHTML = "";
	}

	static display(app, data, target = DOM.readout) {
		UI.reset();

		Object.keys(data).forEach((key) => {
			let current = data[key];
			let entry = document.createElement("div");
			entry.classList.add("entry");
			entry.id = key;
			current.id = key;

			// replace fields in template with corresponding data
			entry.innerHTML = Format.template(app, current);

			UI.addEntry(app, entry, target);
		});
	}

	static menu(app, template) {
		let menu = document.createElement("div");
		menu.id = "modal";
		menu.innerHTML = template;

		DOM.body.insertAdjacentElement("beforeend", menu);

		// grab the form type
		let type = template.split(">")[0].trim();
		type = type.substr(4, type.length - 6);

		if (type == "PROJECT") {
			let clientDD = document.querySelector("#client-ID");
			let appClients = Object.keys(app.clients);

			appClients.forEach((cli) => {
				let option = document.createElement("option");
				option.value = cli;
				option.innerText = app.clients[cli].name;
				clientDD.insertAdjacentElement("afterbegin", option);
			});

			let option = document.createElement("option");
			option.value = "";
			option.disabled = true;
			option.hidden = true;
			option.selected = true;
			option.innerText = "Select Client";
			clientDD.insertAdjacentElement("beforeend", option);
		}

		// add event listener to the freshly-generated back button

		document.querySelector("#back").addEventListener("click", () => {
			UI.reset();
			UI.display(app, app.clients);
		});

		// add event listener to the freshly-generated submit button
		document.querySelector("#submit").addEventListener("click", () => {
			// if the form is for a client...
			if (type == "CLIENT") {
				// grab and store form values
				const FORM = {
					clientName: document.querySelector("#client-name"),
					clientAddress: document.querySelector("#client-address"),
					clientCity: document.querySelector("#client-city"),
					clientState: document.querySelector("#client-state"),
					clientZip: document.querySelector("#client-zip"),
					clientCountry: document.querySelector("#client-country"),
					clientContactName: document.querySelector("#client-contact"),
					clientEmail: document.querySelector("#client-email"),
					clientPhone: document.querySelector("#client-phone"),
					clientRate: document.querySelector("#client-rate"),
					clientInvoiceFrequency: document.querySelector("#client-frequency"),
					clientNotes: document.querySelector("#client-notes"),
				};

				// build new Client object
				const data = {
					Address: FORM.clientAddress.value.trim(),
					City: FORM.clientCity.value.trim(),
					Contact: FORM.clientContactName.value.trim(),
					Country: FORM.clientCountry.value.trim(),
					Email: FORM.clientEmail.value.trim(),
					Invoice_Frequency: FORM.clientInvoiceFrequency.value,
					Name: FORM.clientName.value.trim(),
					Notes: FORM.clientNotes.value.trim(),
					Phone: FORM.clientPhone.value.trim(),
					Rate: FORM.clientRate.value.trim(),
					State: FORM.clientState.value.trim(),
					Zip: FORM.clientZip.value.trim(),
				};

				// create new client object and validate
				let newClient = new Client(data);
				let errors = newClient.validate();

				// Show warning if there are errors. Run if not.
				if (errors.length > 0) {
					// show warning
					let message = "";
					errors.forEach((error) => {
						message += `• ${error}\n`;
					});
					alert(message);
					// UI.message();   //  << NEED TO WRTIE FUNCTION TO HAVE NICER ALERT!!
				}
				else {
					// pass the object to save it
					app.addClient(newClient);
					app.deriveProperties();
					UI.display(app, app.clients, TEMPLATES.entries.client);
				}
			}
			else if (type == "PROJECT") {
				const FORM = {
					projectName: document.querySelector("#project-name"),
					projectRate: document.querySelector("#project-rate"),
					projectDescription: document.querySelector("#project-description"),
					projectClientID: document.querySelector("#client-ID"),
				};

				// build new project object
				const data = {
					Name: FORM.projectName.value.trim(),
					Description: FORM.projectDescription.value.trim(),
					Rate: FORM.projectRate.value.trim(),
					Client_ID: FORM.projectClientID.value,
				};

				// create new project object and validate
				let newProject = new Project(data);
				let errors = newProject.validate();

				// Show warning if there are errors. Run if not.
				if (errors.length > 0) {
					// show warning
					let message = "";
					errors.forEach((error) => {
						message += `• ${error}\n`;
					});
					alert(message);
					// UI.message();   // TODO: WRTIE FUNCTION TO HAVE NICER ALERT!! <----------------------
				}
				else {
					// pass the object to the app to save it
					app.addProject(newProject);
					app.deriveProperties();
					UI.display(app, app.projects, TEMPLATES.entries.project);
				}
			}
		});
	}

	static setUpEventListeners(app) {
		// Add Main Control Event Listeners
		DOM.btn_NewClient.addEventListener("click", function() {
			UI.menu(app, TEMPLATES.menus.client);
		});
		DOM.btn_NewProject.addEventListener("click", function() {
			UI.menu(app, TEMPLATES.menus.project);
		});

		// Add Event listeners to Highlight clicked Filter Buttons
		DOM.filters.addEventListener("click", function(e) {
			let target = e.target;
			if (target.tagName == "BUTTON") {
				let buttons = DOM.filters.querySelectorAll("button");
				buttons.forEach((button) => {
					button.classList.remove("selected");
				});
				target.classList.add("selected");
			}
		});

		// Add Filter Event Listeners
		DOM.btn_Clients.addEventListener("click", function() {
			UI.reset();
			UI.display(app, app.clients);
		});
		DOM.btn_Projects.addEventListener("click", function() {
			UI.reset();
			UI.display(app, app.projects);
		});
		DOM.btn_Sessions.addEventListener("click", function() {
			UI.reset();
			UI.display(app, app.sessions);
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
		if (timestamp) {
			let date = timestamp.toDate().toString().split(" ");
			return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
		}
		else {
			return "-";
		}
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

	static template(app, data) {
		let temp = data.template;

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
			temp = temp.replace(/%totalHours/g, `${data.totalHours} hrs`);
		}
		if (temp.includes("%duration")) {
			temp = temp.replace(/%duration/g, `${data.duration} hrs`);
		}
		if (temp.includes("%breaks")) {
			temp = temp.replace(/%breaks/g, `${data.breaks} hrs`);
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

class Animator {
	static expand(element, time) {
		// set maxHeight by getting the 'auto' height of the element
		element.style.height = "auto";
		let maxHeight = parseFloat(window.getComputedStyle(element).height);
		let interval = 5;

		// calculate the magnitude the height should increase each step
		let stepCount = time * 1000 / interval;
		let stepMagnitude_height = maxHeight / stepCount;
		let stepMagnitude_padding = 1 / stepCount;

		// set the initial state of the element
		element.style.height = 0;
		element.style.padding = "0 1em";
		element.style.marginBottom = "1em";

		// start the animation
		let i = setInterval(animate, interval);

		// actual animation loop
		function animate() {
			// grab the current height
			let currentHeight = parseFloat(element.style.height);
			let currentPadding = parseFloat(element.style.paddingBottom);
			let currentMargin = parseFloat(element.style.marginBottom);

			// check if the
			if (currentHeight >= maxHeight - 1) {
				element.style.height = "auto";
				element.style.paddingBottom = "0";
				element.style.marginBottom = "2em";
				clearInterval(i);
			}
			else {
				element.style.height = `${currentHeight + stepMagnitude_height}px`;
				element.style.padding = `${currentPadding + stepMagnitude_padding}em 1em`;
				element.style.marginBottom = `${currentMargin + stepMagnitude_padding}em`;
			}
		}
	}

	static collapse(element, time) {
		let maxHeight = parseFloat(window.getComputedStyle(element).height);
		let interval = 5;

		// calculate the magnitude the height should increase each step
		let stepCount = time * 1000 / interval;
		let stepMagnitude_height = maxHeight / stepCount;
		let stepMagnitude_padding = 1 / stepCount;

		// set the initial state of the element
		element.style.height = maxHeight + "px";
		// element.style.padding = "0 1em";
		// element.style.marginBottom = "1em";

		// start the animation
		let i = setInterval(animate, interval);

		// actual animation loop
		function animate() {
			// grab the current height
			let currentHeight = parseFloat(element.style.height);
			let currentPadding = parseFloat(element.style.paddingTop);
			let currentMargin = parseFloat(element.style.marginBottom);

			// check if the
			if (currentHeight <= stepMagnitude_height) {
				element.remove();
				clearInterval(i);
			}
			else {
				element.style.height = `${currentHeight - stepMagnitude_height}px`;
				element.style.padding = `${currentPadding - stepMagnitude_padding}em 1em`;
				element.style.marginBottom = `${currentMargin - stepMagnitude_padding}em`;
			}
		}
	}
}

let main = new App("chucksef@gmail.com");
