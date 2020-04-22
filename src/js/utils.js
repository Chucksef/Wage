import { UI } from "./ui";

class Utils {
	static clearListeners(elem) {
		let newElem = elem.cloneNode(true);
		elem.parentNode.replaceChild(newElem, elem);
		return newElem;
	}

	static parseError(code) {
		switch (code) {
			case "auth/invalid-email":
				UI.toast(`Email address is not valid`);
				break;
			case "auth/user-not-found":
				UI.toast(`No user found for email address`);
				break;
			case "auth/wrong-password":
				UI.toast(`Incorrect Password`, "warning");
				break;
			case "auth/email-already-in-use":
				UI.toast("Cannot Create New Account:<br>Email Already In Use", "warning")
				break;
		}
	}
}

export { Utils };
