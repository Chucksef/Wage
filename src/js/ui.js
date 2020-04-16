import { Format } from "./format.js";
import { Animator } from "./animator.js";
import { DOM } from "../index.js";
import { TEMPLATES } from "./template.js";
import { Project } from "./project.js";
import { Client } from "./client.js";

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
		if (target.classList.contains("expanded")) {
			let childContainer = document.createElement("div");
			if (object.type == "client") {
				childContainer.classList.add("childProjects");
			} else if (object.type == "project") {
				childContainer.classList.add("childSessions");

				// If activeSession is blank...
				if (app.activeSession == null) {
					// add a "Clock In" Button to the top of the list of sessions
					let clock = document.createElement("button");
					clock.classList.add("btn-large", "btn-block");
					clock.id = "clock-in";

					// CLICK Clock-In button
					clock.addEventListener("click", () => {
						// clock in @ the project
						let projectID = clock.parentNode.previousSibling.id;
						app.clockIn(projectID);

						// create and add a new "Active Session" element
						let activeSess = document.createElement("div");
						activeSess.classList.add("entry", "active", "trans");
						activeSess.type = "session";
						activeSess.innerHTML = "<h4 class='trans'>Active Session</h4>";
						clock.parentNode.insertAdjacentElement("afterbegin", activeSess);

						// remove the clock-in button
						clock.remove();

						// transition the new entry
						activeSess.classList.remove("trans");
					});
					clock.innerText = "Clock In";

					childContainer.insertAdjacentElement("afterbegin", clock);
				}
			}

			// place childContainer AFTER END of the expanded target
			target.insertAdjacentElement("afterend", childContainer);

			// fill childContainer with children
			let children = app.getChildren(object);
			UI.display(app, children, childContainer);
			Animator.expand(childContainer, 0.2);
		} else {
			// if it's not expanded, remove all children shit
			Animator.collapse(target.nextSibling, 0.2);
		}
	}

	static reset() {
		UI.hideMenu();

		// clear the actual readout
		DOM.readout.innerHTML = "";
	}

	static zoom(app, objectID) {
		// reset display to all clients
		UI.display(app, app.clients);
		let currentSession = app.sessions[objectID];
		let currentProject;
		let currentClient;

		// if there is a current session...
		if (currentSession) {
			// find the project that this session belongs to
			currentProject = app.projects[currentSession.projectID];
			currentClient = app.clients[currentProject.clientID];

			// expand the client by ID
			const clientElem = document.querySelector(`#${currentClient.id}`);
			UI.toggleExpand(app, clientElem, currentClient);

			// set timeout to expand by project in .3s
			setTimeout(expandProject, 300);

			function expandProject() {
				// expand the project by ID
				const projectElem = document.querySelector(`#${currentProject.id}`);
				UI.toggleExpand(app, projectElem, currentProject);
			}
		} else {
			// there is no session with this ID. Check if it's a project
			currentProject = app.projects[objectID];
			if (currentProject) {
				currentClient = app.clients[currentProject.clientID];

				// expand the client by ID
				const clientElem = document.querySelector(`#${currentClient.id}`);
				UI.toggleExpand(app, clientElem, currentClient);

				// set timeout to expand by project in .3s
				setTimeout(expandProject, 300);

				function expandProject() {
					// expand the project by ID
					const projectElem = document.querySelector(`#${currentProject.id}`);
					UI.toggleExpand(app, projectElem, currentProject);
				}
			} else {
				// original object must be a client...
				currentClient = app.clients[objectID];

				// expand the client by ID
				const clientElem = document.querySelector(`#${currentClient.id}`);
				UI.toggleExpand(app, clientElem, currentClient);
			}
		}
	}

	static display(app, dataSet, target = DOM.readout) {
		// build a sorted array from the dataSet
		let sorted = [];
		let keys = Object.keys(dataSet);
		keys.forEach((key) => {
			let currentObj = dataSet[key];

			for (let i = 0; i <= sorted.length; i++) {
				if (sorted[i] == undefined) {
					sorted.push(currentObj);
					i++;
					// compare the lastAccessed properties of currentObj and the current item in the sorted array
				} else if (currentObj.lastAccessed > sorted[i].lastAccessed) {
					sorted.splice(i, 0, currentObj);
					break;
				}
			}
		});

		for (let i = 0; i < sorted.length; i++) {
			let currentObj = app.getObject(sorted[i].id);
			let entry = document.createElement("div");
			entry.classList.add("entry");
			entry.id = currentObj.id;
			entry.type = currentObj.type;
			entry.innerHTML = Format.template(app, currentObj);
			let tag = entry.querySelector(".tag");

			if (entry.type == "session") {
				entry.classList.add("session");
			}

			// delete the tag element if this is THE active session
			if (app.activeSession == currentObj.id) {
				// remove the controls to delete/edit
				tag.remove();

				//remove the second two child-elements
				entry.classList.add("active");
				entry.innerHTML = "<div class='inset-border'><h4>Active Session</h4></div>";
			}

			/*
			ADD TAG CONTROL ELEMENTS IF THERE'S STILL A TAG ELEMENT
			*/

			if (tag) {
				tag.addEventListener("mouseenter", showControls, false);
				tag.addEventListener("mouseleave", hideControls, false);
				UI.addEntry(app, entry, target);
				// show the controls
				function showControls() {
					// add the delete button
					let deleteButton = document.createElement("button");
					deleteButton.id = "delete-button";
					deleteButton.classList.add("material-icons");
					deleteButton.innerText = "delete";
					this.insertAdjacentElement("afterbegin", deleteButton);
					deleteButton.addEventListener("click", (e) => {
						// stop propagation
						e.stopPropagation();

						// show the confirm menu on click
						// replace the %type with the item type
						let temp = TEMPLATES.menus.delete.replace(
							/%type/g,
							currentObj.type.charAt(0).toUpperCase() + currentObj.type.slice(1),
						);

						UI.menu(app, temp);
						// add functionality to the menu buttons
						document.querySelector("#cancel").addEventListener("click", () => {
							UI.hideMenu();
						});
						document.querySelector("#submit").addEventListener("click", () => {
							UI.hideMenu();
							app.deleteItem(currentObj);
						});
					});

					// add the edit button
					let editButton = document.createElement("button");
					editButton.id = "edit-button";
					editButton.classList.add("material-icons");
					editButton.innerText = "edit";
					this.insertAdjacentElement("afterbegin", editButton);
					editButton.addEventListener("click", (e) => {
						/*
						SHOW ENTRY EDIT MENU...
						*/

						// stop propagation
						e.stopPropagation();

						let FORM;

						// find out what kind of item this is...
						if (currentObj.type == "client") {
							UI.menu(app, TEMPLATES.menus.client);

							// grab all the client form fields
							FORM = {
								title: document.querySelector(".menu h1"),
								address: document.querySelector("#client-address"),
								city: document.querySelector("#client-city"),
								contactName: document.querySelector("#client-contact"),
								country: document.querySelector("#client-country"),
								email: document.querySelector("#client-email"),
								invoiceFrequency: document.querySelector("#client-frequency"),
								name: document.querySelector("#client-name"),
								notes: document.querySelector("#client-notes"),
								phone: document.querySelector("#client-phone"),
								rate: document.querySelector("#client-rate"),
								state: document.querySelector("#client-state"),
								zip: document.querySelector("#client-zip"),
								saveButton: document.querySelector("#submit"),
							};

							// set the form's fields to match currentObj's properties
							FORM.title.innerText = "Edit Client";
							FORM.address.value = currentObj.address;
							FORM.city.value = currentObj.city;
							FORM.contactName.value = currentObj.contactName;
							FORM.country.value = currentObj.country;
							FORM.email.value = currentObj.email;
							FORM.invoiceFrequency.value = currentObj.invoiceFrequency;
							FORM.name.value = currentObj.name;
							FORM.notes.value = currentObj.notes;
							FORM.phone.value = currentObj.phone;
							FORM.rate.value = currentObj.rate;
							FORM.state.value = currentObj.state;
							FORM.zip.value = currentObj.zip;

							// replace Save Button to clear Event listeners
							let newSaveButton = FORM.saveButton.cloneNode(true);
							FORM.saveButton.parentNode.replaceChild(newSaveButton, FORM.saveButton);

							// add client-specific event listener
							newSaveButton.addEventListener("click", () => {
								// find and update client in app CPS model
								let updatedClient = app.clients[currentObj.id];
								updatedClient.address = FORM.address.value;
								updatedClient.city = FORM.city.value;
								updatedClient.contactName = FORM.contactName.value;
								updatedClient.country = FORM.country.value;
								updatedClient.email = FORM.email.value;
								updatedClient.invoiceFrequency = FORM.invoiceFrequency.value;
								updatedClient.name = FORM.name.value;
								updatedClient.notes = FORM.notes.value;
								updatedClient.phone = FORM.phone.value;
								updatedClient.rate = FORM.rate.value;
								updatedClient.state = FORM.state.value;
								updatedClient.zip = FORM.zip.value;

								// find and updated client in FireStore
								app.updateEntry(updatedClient);

								UI.reset();
								UI.hideMenu();
								UI.zoom(app, updatedClient.id);
							});
						} else if (currentObj.type == "project") {
							UI.menu(app, TEMPLATES.menus.project);

							// grab all the client form fields
							FORM = {
								title: document.querySelector(".menu h1"),
								clientID: document.querySelector("#client-ID"),
								description: document.querySelector("#project-description"),
								name: document.querySelector("#project-name"),
								rate: document.querySelector("#project-rate"),
								saveButton: document.querySelector("#submit"),
							};

							// set the form's fields to match currentObj's properties
							FORM.title.innerText = "Edit Project";
							FORM.clientID.value = currentObj.clientID;
							FORM.description.value = currentObj.description;
							FORM.name.value = currentObj.name;
							FORM.rate.value = currentObj.rate;

							// replace Save Button to clear Event listeners
							let newSaveButton = FORM.saveButton.cloneNode(true);
							FORM.saveButton.parentNode.replaceChild(newSaveButton, FORM.saveButton);

							// add project-specific event listener
							newSaveButton.addEventListener("click", () => {
								// find and update project in app CPS Model
								let updatedProject = app.projects[currentObj.id];
								updatedProject.clientID = FORM.clientID.value;
								updatedProject.description = FORM.description.value;
								updatedProject.name = FORM.name.value;
								updatedProject.rate = FORM.rate.value;

								// find and updated project in FireStore
								app.updateEntry(updatedProject);

								UI.reset();
								UI.hideMenu();
								UI.zoom(app, updatedProject.id);
							});
						} else {
							// type = "session"...
							UI.menu(app, TEMPLATES.menus.session);

							// grab all the client form fields
							FORM = {
								title: document.querySelector(".menu h1"),
								clientName: document.querySelector(".menu h3"),
								projectName: document.querySelector(".menu h5"),
								breaks: document.querySelector("#session-breaks"),
								clockInDate: document.querySelector("#session-clockInDate"),
								clockInTime: document.querySelector("#session-clockInTime"),
								clockOutDate: document.querySelector("#session-clockOutDate"),
								clockOutTime: document.querySelector("#session-clockOutTime"),
								cancelButton: document.querySelector("#cancel"),
								saveButton: document.querySelector("#submit"),
							};

							FORM.title.innerText = "Edit Session";
							FORM.clientName.innerText = currentObj.clientName;
							FORM.projectName.innerText = currentObj.projectName;
							FORM.breaks.value = currentObj.breaks;
							FORM.clockInDate.value = Format.dateForInput(currentObj.clockIn);
							FORM.clockInTime.value = Format.timeForInput(currentObj.clockIn);
							FORM.clockOutDate.value = Format.dateForInput(currentObj.clockOut);
							FORM.clockOutTime.value = Format.timeForInput(currentObj.clockOut);

							// replace Save Button to clear Event listeners
							let newSaveButton = FORM.saveButton.cloneNode(true);
							FORM.saveButton.parentNode.replaceChild(newSaveButton, FORM.saveButton);

							// add session-specific event listener
							newSaveButton.addEventListener("click", () => {
								// generate new timestamps
								let newStampIn = Format.getTimestamp(FORM.clockInDate.value, FORM.clockInTime.value);
								let newStampOut = Format.getTimestamp(FORM.clockOutDate.value, FORM.clockOutTime.value);

								// find and update session in app CPS Model
								let updatedSession = app.sessions[currentObj.id];
								updatedSession.clockIn = newStampIn;
								updatedSession.clockOut = newStampOut;
								updatedSession.breaks = FORM.breaks.value;

								// find and updated session in FireStore
								app.updateEntry(updatedSession);

								UI.reset();
								UI.hideMenu();
								UI.zoom(app, updatedSession.id);
							});
						}
					});
				}
				// hide the controls
				function hideControls() {
					let deleteButton = this.querySelector("#delete-button");
					let editButton = this.querySelector("#edit-button");
					deleteButton.remove();
					editButton.remove();
				}
			}
		}
	}

	static menu(app, template, allowBack = true) {
		let modalBG = document.createElement("div");
		modalBG.id = "modal";
		modalBG.classList.add("transparent");
		modalBG.innerHTML = template;

		DOM.body.insertAdjacentElement("beforeend", modalBG);
		setTimeout(()=>{
			modalBG.classList.remove("transparent");
		},1);

		if (allowBack) {
			// add a hideMenu() eventListener to the modal background
			modalBG.addEventListener("click", (e) => {
				if (e.target == modalBG) {
					UI.hideMenu();
				}
			});
		}

		// grab the form type
		let type = template.split(">")[0].trim();
		type = type.substr(4, type.length - 6);

		// populate the select client menu
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
		} else if (type == "SESSION") {
			document.querySelector("#cancel").addEventListener("click", () => {
				UI.hideMenu();
			});
		}

		// add event listener to the freshly-generated back button
		let backButton = document.querySelector("#back");
		if (backButton) {
			if (allowBack) {
				// add event listener to the freshly-generated back button
				document.querySelector("#back").addEventListener("click", () => {
					UI.hideMenu();
				});
			} else {
				document.querySelector("#back").remove();
			}
		}

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
				} else {
					// pass the object to save it
					app.addClient(newClient);
					app.deriveProperties();
					UI.reset();
					UI.display(app, app.clients);
				}
			} else if (type == "PROJECT") {
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
				} else {
					// pass the object to the app to save it
					app.addProject(newProject);
					app.deriveProperties();
					UI.reset();
					UI.display(app, app.clients);
				}
			}
		});

		// grab the actual menu and some key properties used to animate it...
		let menu = document.querySelector(".menu");

		// calculate the value that will put the menu offscreen...
		let parHeight = parseFloat(window.getComputedStyle(menu.parentNode).height);
		let menuHeight = parseFloat(window.getComputedStyle(menu).height);
		let mag = menuHeight + (parHeight - menuHeight) / 2;

		// animate the menu
		Animator.flyIn(menu, "bottom", mag, 0.5, 0);
	}

	static hideMenu() {
		let modal = document.querySelector("#modal");
		let menu = document.querySelector(".menu");
		modal.classList.add("transparent");

		if (modal) {
			let parHeight = parseFloat(window.getComputedStyle(menu.parentNode).height);
			let menuHeight = parseFloat(window.getComputedStyle(menu).height);
			let mag = menuHeight + (parHeight - menuHeight) / 2;

			Animator.flyOut(menu, "bottom", mag, 0.5, 0);

			setTimeout(remove, 500);
		}

		function remove() {
			modal.remove();
		}
	}

	static setUpEventListeners(app) {
		// Add Main Control Event Listeners
		DOM.btn_NewClient.addEventListener("click", function() {
			UI.menu(app, TEMPLATES.menus.client);
		});
		DOM.btn_NewProject.addEventListener("click", function() {
			UI.menu(app, TEMPLATES.menus.project);
		});
	}

	static showClock(app, session, speed, delay) {
		// build clock element
		let clock = document.createElement("button");
		clock.classList.add("btn-block");
		clock.id = "clock";
		clock.innerHTML = TEMPLATES.clock;
		clock.addEventListener("click", () => {
			app.clockOut(session.id);
		});

		// add the clock to the DOM
		DOM.timer.insertAdjacentElement("beforeend", clock);

		// get total value for when the window will be out of screen
		let mag = parseFloat(window.getComputedStyle(clock).height);
		mag += parseFloat(window.getComputedStyle(clock).marginBottom);

		// call animation
		Animator.flyIn(DOM.timer, "bottom", mag, speed, delay);

		// grab the 3 output fields in the clock element
		let clockTime = DOM.timer.querySelector("h3");
		let clockClient = DOM.timer.querySelector("h6");
		let clockProject = DOM.timer.querySelector("p");

		// fill in the project name
		clockProject.innerText = app.projects[session.projectID].name;
		clockClient.innerText = app.clients[app.projects[session.projectID].clientID].name;

		app.timer = setInterval(updateTime, 1000);

		function updateTime() {
			// get current time in seconds
			let now = new Date();
			let jsTime = now.getTime().toString();
			jsTime = parseInt(jsTime.substr(0, jsTime.length - 3));

			// calculate difference in time since session was created and now
			let deltaTime = jsTime - session.clockIn.seconds;

			// format difference to HH:MM:SS
			let hhmmss = Format.secondsToHours(deltaTime);

			// update element
			clockTime.innerText = hhmmss;
		}
	}

	static hideClock() {
		// get the value for when the element will be out of screen
		let mag = parseFloat(window.getComputedStyle(clock).height);
		mag += parseFloat(window.getComputedStyle(clock).marginBottom);

		Animator.flyOut(DOM.timer, "bottom", mag, 0.75);
		setTimeout(() => {
			document.querySelector("#clock").remove();
			DOM.timer.style.bottom = "0";
		}, 1000);
	}
}

export { UI };
