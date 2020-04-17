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
		DOM.btn_SignOut.addEventListener("click", Auth.signOut);

		// Cheeky shortcut to signing in by clicking on menu      <------------------------------------------------------------------- DELETE ME LATER!!!
		document.querySelector(".centered").addEventListener("click", () => {
			document.querySelector("#welcome").style.display = "none";
			new App("iJ2DJB2YABeSFWsOwpxqU6Ve1GX2");
		});
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

		submit.addEventListener("click", signUserIn);

		function signUserIn() {
			const email = document.querySelector("#signIn-email").value;
			const password = document.querySelector("#signIn-password").value;

			auth.signInWithEmailAndPassword(email, password).then((cred) => {
				console.log(`Successfully logged in user: ${cred.user.email}!`);
				new App(cred.user.uid);
				UI.hideMenu();
				document.querySelector("#welcome").style.display = "none";
			});
		}
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

		submit.addEventListener("click", signUserUp);

		// checks the password for confirmation and signs the user in
		function signUserUp() {
			const email = document.querySelector("#signUp-email").value;
			const password = document.querySelector("#signUp-password").value;
			const confirmation = document.querySelector("#signUp-confirmation").value;

			// check if password and confirmation match...
			if (password === confirmation) {
				// create the user and log in!
				auth.createUserWithEmailAndPassword(email, password).then((cred) => {
					console.log(`Successfully signed up new user: ${cred.user.email}!`);
					new App(cred.user.uid);
					UI.hideMenu();
					document.querySelector("#welcome").style.display = "none";
				});
			} else {
				alert("Password and Confirmation must match!");
			}
		}
	}

	static signOut() {
		auth.signOut();
		document.querySelector("#welcome").style.display = "flex";
		DOM.ham.classList.remove("show");
		UI.reset();
	}
}

export { Auth };
