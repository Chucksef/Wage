import { DOM } from './dom';
import { UI } from './ui';
import { Utils } from './utils';
import { TEMPLATES } from './template';

class Tutorial {
    static event1() {
        Tutorial.highlight(DOM.btn_NewClient, Tutorial.event2);
		DOM.title.innerText = "Welcome!";
		DOM.msg.innerText = "This short tutorial will show you the basics of using 'wage'. Please click the highlighted 'Client' button above to start the process of building your portfolio!\n\nYou may also skip this tutorial at any time using the button below."
    }

    static event2() {
        UI.menu(window.app, TEMPLATES.menus.client);

        Tutorial.hideHighlight();
        
        let backButton = document.querySelector("#back");

        setTimeout(showHighlight, 750);

        function showHighlight() {
            Tutorial.highlight(backButton, Tutorial.event3);
        }
    }

    static event3() {
        UI.hideMenu();

        Tutorial.highlight(DOM.btn_NewProject, Tutorial.event4);

		DOM.title.innerText = "Clients and Projects";
		DOM.msg.innerText = "Congratulations!\n\nYou can fill out your impressive roster of clients later. Afterwards, you'll want to add Projects to each client.\n\nEven if the project is just called 'General,' it's still a good idea to keep it organized.\n\nClick the 'New Project' button now to check it out before closing it and returning back here.";
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
		DOM.msg.innerText = "You can fill add clients later. Once you do, you'll want to add Projects to each client.\nClick the New Project button now to check it out.";
    }

    static event6() {
        UI.hideMenu()
    }

    static highlight(elem, func) {
		// clear the highlight's event listeners
		DOM.highlight = Utils.clearListeners(DOM.highlight);
		
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
        DOM.highlight.style.left = `25000px`;
    }
}

export { Tutorial };