import { DOM } from "./dom";
import { UI } from "./ui";
import { TEMPLATES } from "./template";

class Auth {
	constructor() {
		DOM.btn_SignIn.addEventListener("click", Auth.showSignInMenu);
		DOM.btn_SignUp.addEventListener("click", Auth.showSignUpMenu);
	}
	static showSignInMenu() {
		UI.menu(null, TEMPLATES.menus.signIn);
	}

	static showSignUpMenu() {
		UI.menu(null, TEMPLATES.menus.signUp);
	}
}

export { Auth };
