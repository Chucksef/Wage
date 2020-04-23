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

	static getOOBValue(elem, dir="bottom", pad=0) {
		switch (dir) {
			case "bottom":
			case "top":
				let parentHeight = parseFloat(window.getComputedStyle(elem.parentNode).height);
				let elemHeight = parseFloat(window.getComputedStyle(elem).height);
				return (elemHeight + (parentHeight - elemHeight) / 2) + pad;
				break;
			case "left":
			case "right":
				let parentWidth = parseFloat(window.getComputedStyle(elem.parentNode).Width);
				let elemWidth = parseFloat(window.getComputedStyle(elem).Width);
				return (elemWidth + (parentWidth - elemWidth) / 2) + pad;
				break;
		}
		
	}
}

export { Utils };
