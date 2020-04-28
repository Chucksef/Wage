import { DOM } from './dom';
import { UI } from './ui';
import { Utils } from './utils';
import { TEMPLATES } from './template';

class Tutorial {
    static event1() {

        Tutorial.hideHighlight();

		DOM.title.innerText = "Welcome!";
        DOM.msg.innerText = `Thank you for trying out Wage!\n
                                This tutorial will show you the basics of using the app, including creating clients and projects, clocking in/out, and editing your records.\n
                                Please click the highlighted 'Client' button above to start the process of building your portfolio!\n
                                You may also skip this tutorial at any time using the button below.`;

        setTimeout(showHighlight, 750);

        function showHighlight() {
            Tutorial.highlight(DOM.btn_NewClient, Tutorial.event2);
        }
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
        document.querySelector("#client-contact").value = "Dr. John Magoogle";
        document.querySelector("#client-email").value = "drjohn@google.com";
        document.querySelector("#client-phone").value = "(650) NOT-EVIL";
        document.querySelector("#client-rate").value = "40.00";
        document.querySelector("#client-frequency").value = "bi-weekly";

        Tutorial.hideHighlight();

        UI.toast("We've taken the liberty of filling out this form for you.\nTake a minute to look it over before clicking the highlighted Save button below.\n\nThese messages will go away on their own, or you can click them to dismiss immediately.", "info");
        
        let submit = document.querySelector("#submit");

        setTimeout(showHighlight, 750);

        function showHighlight() {
            Tutorial.highlight(submit, Tutorial.event3);
        }
    }

    static event3() {
        document.querySelector("#submit").click();

        
		DOM.title.innerText = "Clients and Projects";
        DOM.msg.innerText = `Congratulations on landing the big Google account!\n
                                Next, let's add our first project we'll be working on.\n
                                Click the 'New Project' button now.`;
        
        Tutorial.highlight(DOM.btn_NewProject, Tutorial.event4);
    }

    static event4() {
        UI.menu(window.app, TEMPLATES.menus.project);
        document.querySelector("#client-ID").selectedIndex = 0;
        document.querySelector("#project-name").value = "Invent new search algorithm";
        document.querySelector("#project-description").value = `• Keep Dr. Magoogle informed with regular emails.\n• Never refer to him as Dr. Google.`;

        UI.toast("This is the New Project form, conveniently filled out for you.\nNotice that we didn't fill out anything under 'Project Hourly Rate'.\nThat's because we want Wage to default to using our client's hourly rate of $40/hour.", "info");

        Tutorial.hideHighlight();
        
        let submit = document.querySelector("#submit");

        setTimeout(showHighlight, 750);

        function showHighlight() {
            Tutorial.highlight(submit, Tutorial.event5);
        }
    }

    static event5() {
        document.querySelector("#submit").click();

		DOM.title.innerText = "Clocking In";
        DOM.msg.innerText = `Now that you have your first client and project, you should get to work!\n
                                To clock in, we'll first need to find the project we'd like to work on. To do so, click on the client entry above...`;

        Tutorial.highlight(document.querySelector(".entry"), Tutorial.event6);
    }

    static event6() {
        document.querySelector(".entry").click();

        Tutorial.hideHighlight();

        DOM.msg.innerText = `Good. Now click the project highlighted...`;

        setTimeout(showHighlight, 250);

        function showHighlight() {
            Tutorial.highlight(document.querySelector(".childProjects .entry"), Tutorial.event7);
        }
    }

    static event7() {
        document.querySelector(".childProjects .entry").click();

        Tutorial.hideHighlight();

        DOM.msg.innerText = `This is the clock-in button. Clicking this button will start logging your time towards the project it falls beneath.\n\nClick it now.`;

        setTimeout(showHighlight, 250);

        function showHighlight() {
            Tutorial.highlight(document.querySelector("#clock-in"), Tutorial.event8);
        }
    }

    static event8() {
        document.querySelector("#clock-in").click();

        Tutorial.hideHighlight();

        DOM.title.innerText = `Clocking Out`
        DOM.msg.innerText = `You are now officially on the clock!\n
                                The clock, highlighted in the lower left, will run until you clock out, whether that's in two seconds or twelve years!\n
                                Go ahead and click it now.
        `;

        setTimeout(showHighlight, 750);

        function showHighlight() {
            Tutorial.highlight(document.querySelector("#clock"), Tutorial.event9);
        }
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