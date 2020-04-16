import { DOM } from "./dom";
import { UI } from "./ui";
import { TEMPLATES } from "./template";
import { Utils } from "./utils";
import { auth } from "./firebase";
import { App } from "./app";

class Auth {
	constructor() {
		DOM.btn_SignIn.addEventListener("click", Auth.showSignInMenu);
		DOM.btn_SignUp.addEventListener("click", Auth.showSignUpMenu);
	}
	static showSignInMenu() {
		UI.menu(null, TEMPLATES.menus.signIn);

		// duplicate both buttons to clear event listeners
		const cancel = Utils.clearListeners(document.querySelector("#cancel"));
		const submit = Utils.clearListeners(document.querySelector("#submit"));

		// assign new event listeners
		cancel.addEventListener("click", () => {
			UI.hideMenu();
		});

		submit.addEventListener("click", () => {});
	}

	static showSignUpMenu() {
		UI.menu(null, TEMPLATES.menus.signUp);

		// duplicate both buttons to clear event listeners
		const cancel = Utils.clearListeners(document.querySelector("#cancel"));
		const submit = Utils.clearListeners(document.querySelector("#submit"));

		// assign new event listerners
		cancel.addEventListener("click", () => {
			UI.hideMenu();
		});

		submit.addEventListener("click", () => {
			const email = document.querySelector("#signUp-email").value;
			const password = document.querySelector("#signUp-password").value;
			const confirmation = document.querySelector("#signUp-confirmation").value;

			// check if password and confirmation match...
			if (password === confirmation) {
				// create the user and log in!
				auth.createUserWithEmailAndPassword(email, password).then((credentials) => {
					console.log(`Successfully signed up new user: ${credentials.email}`);
					UI.hideMenu();
					new App(credentials.email);
				});
			} else {
				alert("Password and Confirmation must match!");
			}
		});
	}
}

export { Auth };
