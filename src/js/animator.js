import { DOM } from "./dom";

class Timing {
	static easeOut(x, pwr) {
		if (pwr < 1 || pwr > 15 ) {
			console.error("Timing.easeOut() only animates for powers between 1 and 15.");
			return 1 - (1 - x);
		}
		return (1 - (1 - x)**pwr);
	}

	static easeIn(x, pwr) {
		if (pwr < 1 || pwr > 15 ) {
			console.error("Timing.easeIn() only animates for powers between 1 and 15.");
			return (x);
		}
		return x**pwr;
	}
}

class Animator {
	static expand(element, time) {
		// set maxHeight by getting the 'auto' height of the element
		element.style.height = "auto";
		let maxHeight = parseFloat(window.getComputedStyle(element).height);
		let interval = 5;

		// calculate the magnitude the height should increase each step
		let stepCount = time * 1000 / interval;
		let stepMagnitude_height = maxHeight / stepCount;
		let stepMagnitude_padding = 1 / stepCount;

		// set the initial state of the element
		element.style.height = 0;
		element.style.padding = "0 1em";
		element.style.marginBottom = "1em";

		// start the animation
		let i = setInterval(animate, interval);

		// actual animation loop
		function animate() {
			// grab the current height
			let currentHeight = parseFloat(element.style.height);
			let currentPadding = parseFloat(element.style.paddingBottom);
			let currentMargin = parseFloat(element.style.marginBottom);

			// check if the
			if (currentHeight >= maxHeight - 1) {
				element.style.height = "auto";
				element.style.paddingBottom = "0";
				element.style.marginBottom = "2em";
				clearInterval(i);
			} else {
				element.style.height = `${currentHeight + stepMagnitude_height}px`;
				element.style.padding = `${currentPadding + stepMagnitude_padding}em 1em`;
				element.style.marginBottom = `${currentMargin + stepMagnitude_padding}em`;
			}
		}
	}

	static collapse(element, time) {
		let maxHeight = parseFloat(window.getComputedStyle(element).height);
		let interval = 5;

		// calculate the magnitude the height should increase each step
		let stepCount = time * 1000 / interval;
		let stepMagnitude_height = maxHeight / stepCount;
		let stepMagnitude_padding = 1 / stepCount;

		// set the initial state of the element
		element.style.height = maxHeight + "px";

		// start the animation
		let i = setInterval(animate, interval);

		// actual animation loop
		function animate() {
			// grab the current height
			let currentHeight = parseFloat(element.style.height);
			let currentPadding = parseFloat(element.style.paddingTop);
			let currentMargin = parseFloat(element.style.marginBottom);

			// check if the
			if (currentHeight <= stepMagnitude_height) {
				element.remove();
				clearInterval(i);
			} else {
				element.style.height = `${currentHeight - stepMagnitude_height}px`;
				element.style.padding = `${currentPadding - stepMagnitude_padding}em 1em`;
				element.style.marginBottom = `${currentMargin - stepMagnitude_padding}em`;
			}
		}
	}

	static flyIn(element, fromDir="bottom", startPos, time=.5, delay=0) {
		/*
			Animator.flyIn() takes 4 parameters: 
			  * element		DOM ELEMENT		Absolutely or relatively positioned dom element.
			  * fromDir 	STRING			Direction the element will fly-in from. Accepted values: "top", "bottom", "left", "right".
			  * startPos 	INTEGER			Value of fromDir (in pixels) for when the element is off screen.
			  * time		FLOAT			Seconds that the animaton will take to play.
			  * delay		FLOAT			Seconds to wait before playing animation
		*/

		// get/set variables to determine animation progress
		let interval = 5;
		let stepCount = (time * 1000) / interval
		let currentStep = 1;
		element.style[fromDir] = "";
		let endPos = parseFloat(window.getComputedStyle(element)[fromDir]);
		element.style[fromDir] = `${startPos * -1}px`;

		startPos *= -1;
		let totalDisp = endPos-startPos;

		setTimeout(animate, delay*1000);

		let i;
		function animate() {
			i = setInterval(update, interval);
		}

		// actual animation
		function update() {

			if (currentStep < stepCount ) {
				// get % of progress as expressed from 0.00 -> 1.00
				let progress = currentStep/stepCount;

				// get timing coefficient as the returned value from any Timing property using progress as the argument.
				let timingCoef = Timing.easeOut(progress, 3.5);

				// get currentDisp value, which is equal to timingCoef * totalDisp
				let currentDisp = timingCoef * totalDisp;

				element.style[fromDir] = `${startPos + currentDisp}px`;
				currentStep++;
			} else {
				clearInterval(i);
				element.style[fromDir] = `${endPos}px`;
				let shad = window.getComputedStyle(element);
				setTimeout(resetShadow, 5);

				function resetShadow() {
					element.style.boxShadow = shad.boxShadow;
					let shoop;
				}
			}
		}
	}

	static flyOut(element, toDir="bottom", endPos, time=.5, delay=0) {
		/*
			Animator.flyOut() takes 4 parameters: 
			  * element		DOM ELEMENT		Absolutely or relatively positioned dom element.
			  * toDir 		STRING			Direction the element will fly-in from. Accepted values: "top", "bottom", "left", "right".
			  * endPos 		INTEGER			Value of toDir (in pixels) for when the element is off screen.
			  * time		FLOAT			Seconds that the animaton will take to play.
			  * delay		FLOAT			Seconds to wait before playing animation
		*/

		// get/set variables to determine animation progress
		let interval = 5;
		let stepCount = (time * 1000) / interval
		let currentStep = 1;
		let startPos = parseFloat(window.getComputedStyle(element)[toDir]);

		endPos *= -1;
		let totalDisp = endPos-startPos;

		setTimeout(animate, delay*1000);

		let i;
		function animate() {
			i = setInterval(update, interval);
		}

		// actual animation
		function update() {

			if (currentStep < stepCount ) {
				// get % of progress as expressed from 0.00 -> 1.00
				let progress = currentStep/stepCount;

				// get timing coefficient as the returned value from any Timing property using progress as the argument.
				let timingCoef = Timing.easeIn(progress, 3.5);

				// get currentDisp value, which is equal to timingCoef * totalDisp
				let currentDisp = timingCoef * totalDisp;

				element.style[toDir] = `${startPos + currentDisp}px`;
				currentStep++;
			} else {
				clearInterval(i);
				element.style[toDir] = `${endPos}px`;
			}
		}
	}
}

export { Animator };
