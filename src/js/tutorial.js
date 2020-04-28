import { DOM } from './dom';
import { UI } from './ui';
import { Utils } from './utils';
import { TEMPLATES } from './template';

class Tutorial {
    static event1() {
        Tutorial.highlight(DOM.btn_NewClient, Tutorial.event2);
		DOM.title.innerText = "Welcome!";
        DOM.msg.innerText = `Thank you for trying out Wage!\n
                                This tutorial will show you the basics of using the app, including creating clients and projects, clocking in/out, and editing your records.\n
                                Please click the highlighted 'Client' button above to start the process of building your portfolio!\n
                                You may also skip this tutorial at any time using the button below.`;
    }

    static event2() {
        UI.menu(window.app, TEMPLATES.menus.client);
        document.querySelector("#client-name").value = "Google";
        document.querySelector("#client-address").value = "1600 Ampitheatre Parkway";
        document.querySelector("#client-city").value = "Mountain View";
        document.querySelector("#client-state").value = "CA";
        document.querySelector("#client-zip").value = "94043";
        document.querySelector("#client-country").value = "USA";
        document.querySelector("#client-notes").value = "They are always watching you";
        document.querySelector("#client-contact").value = "Dr. John Google";
        document.querySelector("#client-email").value = "drjohn@google.com";
        document.querySelector("#client-phone").value = "(650) NOT-EVIL";
        document.querySelector("#client-rate").value = "40.00";
        document.querySelector("#client-frequency").value = "bi-weekly";

        Tutorial.hideHighlight();

        UI.toast("We've taken the liberty of filling out this form for you.\nTake a minute to look it over before clicking the highlighted Save button below.\n\nThese messages will go away on their own, or you can click them to dismiss immediately.", "success");
        
        let submit = document.querySelector("#submit");

        setTimeout(showHighlight, 750);

        function showHighlight() {
            Tutorial.highlight(submit, Tutorial.event3);
        }
    }

    static event3() {
        document.querySelector("#submit").click();
        UI.hideMenu();

        Tutorial.highlight(DOM.btn_NewProject, Tutorial.event4);

		DOM.title.innerText = "Clients and Projects";
        DOM.msg.innerText = `Congratulations!\n
                                You can fill out your impressive roster of clients later. Afterwards, you'll want to add Projects to each client.\n
                                Even if the project is just called 'General,' it's still a good idea to keep it organized.\n
                                Click the 'New Project' button now to check it out before closing it and returning back here.`;
    }

    static event4() {
        UI.menu(window.app, TEMPLATES.menus.project);

        Tutorial.hideHighlight();
        
        let backButton = document.querySelector("#back");

        setTimeout(showHighlight, 750);

        function showHighlight() {
            Tutorial.highlight(backButton, Tutorial.event5);
        }
    }

    static event5() {
        UI.hideMenu();

        Tutorial.highlight(DOM.btn_NewProject, Tutorial.event6);

		DOM.title.innerText = "Clients";
        DOM.msg.innerText = `
                                You can fill add clients later. Once you do, you'll want to add Projects to each client.\n
                                Click the New Project button now to check it out.`;
    }

    static event6() {
        UI.hideMenu()
    }

    static highlight(elem, func) {
		// clear the highlight's event listeners
        DOM.highlight = Utils.clearListeners(DOM.highlight);
        DOM.highlight.style.display = `block`;
		
		// get computed location of element
		let elemCorners = window.getComputedStyle(elem).borderRadius;
		let elemRect = elem.getBoundingClientRect();

		// set highlight location to encircle the element
		DOM.highlight.style.left = `${elemRect.left}px`;
		DOM.highlight.style.top = `${elemRect.top}px`;
		DOM.highlight.style.width = `${elemRect.width}px`;
		DOM.highlight.style.height = `${elemRect.height}px`;
		DOM.highlight.style.borderRadius = `${elemCorners}`;

		// set the highlight's on-click action
		DOM.highlight.addEventListener("click", func);
    }
    
    static hideHighlight() {
        DOM.highlight.style.display = `none`;
    }
}

export { Tutorial };