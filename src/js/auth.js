import { DOM } from "./dom";
import { UI } from "./ui";
import { TEMPLATES } from "./template";
import { Utils } from "./utils";
import { auth } from "./firebase";
import { App } from "./app";
import { Format } from "./format";
import { Animator } from "./animator";

// listen for auth status changes
auth.onAuthStateChanged(user => {
	if (user) {
		// close the log-in screen
		DOM.body.classList.remove("closed");
		DOM.body.classList.add("opening");
		setTimeout(() => {
			DOM.body.classList.remove("opening");
		}, 1001);
		document.querySelector("#welcome").style.display = "none";
		UI.hideMenu();

		// set up the instance of the app
		let app = new App(user.uid);
		app.user = user;
	} else {
		// show the log-in screen
		DOM.body.classList.add("closed");
		document.querySelector("#welcome").style.display = "flex";

		// fly MainMenu in
		const startPos = Utils.getOOBValue(DOM.mainMenu, "top");
		Animator.flyIn(DOM.mainMenu, "top", startPos, .75);
		
		// reset a few elements
		DOM.ham.classList.add("show");
		DOM.hamOptions.classList.add("show");
		UI.toggleHamburger();
		UI.reset();
	}
})

class Auth {
	constructor() {
		window.toastTimer = null;
		DOM.btn_SignIn.addEventListener("click", Auth.showSignInMenu);
		DOM.btn_SignUp.addEventListener("click", Auth.showSignUpMenu);
		DOM.btn_SignOut.addEventListener("click", Auth.signOut);

		// Cheeky shortcut to signing in by clicking on menu      <------------------------------------------------------------------- DELETE ME LATER!!!
		// document.querySelector("#mainMenu").addEventListener("click", () => {
		// 	auth.signInWithEmailAndPassword("chucksef@gmail.com", "password");
		// });
	}

	static showSignInMenu() {
		const mag = Utils.getOOBValue(DOM.mainMenu, "top", 100);
		Animator.flyOut(DOM.mainMenu, "top", mag, .75);
		UI.menu(null, TEMPLATES.menus.signIn);

		// duplicate both buttons to clear event listeners
		const cancel = Utils.clearListeners(document.querySelector("#cancel"));
		const submit = Utils.clearListeners(document.querySelector("#submit"));
		const reset = Utils.clearListeners(document.querySelector("#reset"));
		
		// assign new event listeners
		cancel.addEventListener("click", () => {
			UI.hideMenu();
			UI.showMain();
		});
		submit.addEventListener("click", signUserIn);
		document.querySelectorAll("input").forEach((input) => {
			input.addEventListener("keydown", checkKey);
		})
		reset.addEventListener("click", sendReset);

		function checkKey(e) {
			if (e.code == "Enter") signUserIn();
		}

		function signUserIn() {
			const email = document.querySelector("#signIn-email").value;
			const password = document.querySelector("#signIn-password").value;

			auth.signInWithEmailAndPassword(email, password).catch((error) => {
				Utils.parseError(error.code);
			});
		}

		function sendReset() {
			const email = document.querySelector("#signIn-email").value;
			if (email != "") {
				auth.sendPasswordResetEmail(email).then(() => {
					UI.toast(`Sending Password Reset Email to ${email}`, "success");
				}).catch((error) => {
					Utils.parseError(error.code);
				});
			} else {
				UI.toast("Please Enter the email address for the account password you would like to reset")
			}
		}
	}

	static showSignUpMenu() {
		const mag = Utils.getOOBValue(DOM.mainMenu, "top", 100);
		Animator.flyOut(DOM.mainMenu, "top", mag, .75);
		UI.menu(null, TEMPLATES.menus.signUp);

		// duplicate both buttons to clear event listeners
		const cancel = Utils.clearListeners(document.querySelector("#cancel"));
		const submit = Utils.clearListeners(document.querySelector("#submit"));

		// assign new event listerners
		cancel.addEventListener("click", () => {
			UI.hideMenu();
			UI.showMain();
		});
		submit.addEventListener("click", signUserUp);

		// checks the password for confirmation and signs the user in
		function signUserUp() {
			const email = document.querySelector("#signUp-email").value;
			const password = document.querySelector("#signUp-password").value;
			const confirmation = document.querySelector("#signUp-confirmation").value;

			// validate inputs and return errors 
			let errors = [];
			if (email == "") errors.push(" • Email missing");
			if (password == "") errors.push(" • Password missing");
			if (confirmation == "") errors.push(" • Confirmation missing");
			if (password !== confirmation) errors.push(" • Password and Confirmation must match");
			if (password.length < 6) errors.push(" • Password must be at least 6 characters long");

			if (errors.length) {
				UI.toast(errors.join("<br>"))
			} else {
				// create the user and log in!
				auth.createUserWithEmailAndPassword(email, password).catch((error) => {
					Utils.parseError(error.code);
				});
			}
		}
	}

	static signOut() {
		auth.signOut();
	}

	
	static updateUser(app, params) {
		let user = auth.currentUser;
		let credential = firebase.auth.EmailAuthProvider.credential(user.email, params.password);
		let updated = [];

		user.reauthenticateWithCredential(credential).then(() => {
			// update the user
			if (params.email) {
				user.updateEmail(params.email);
				updated.push("Email");
			}
			
			if (params.name) {
				user.updateProfile({
					displayName: params.name,
				})
				updated.push("Name");
			}
			
			// let the user know if this worked with a toast message
			UI.toast(`Successfully updated ${Format.list(updated)}`, "success");
			app.user = user;
			UI.hideMenu();
		}).catch((error) => {
			Utils.parseError(error.code);
		});

	}
}

export { Auth };
