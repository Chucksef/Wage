class Timing {
	static ease(x, pwr) {
		if (pwr < 0.01 || pwr > 10 ) {
			console.error("Timing.ease() only animates for powers between 0.01 and 10.")
			return (1 - (1 - x)**1);
		}
		return (1 - (1 - x)**pwr);
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

	static clockIn(element, anchor="top", disp=10, time=.5, delay=1) {
		/*
			Animator.clockIn() takes 4 parameters: 
			  * element		DOM ELEMENT		Absolutely or relatively positioned dom element.
			  * anchor 		STRING			Accepted values: "top", "bottom", "left", "right".
			  * disp 		INTEGER			How far the element will travel in pixels.
			  * time		FLOAT			Seconds that the animaton will take to play.
			  * delay		FLOAT			Seconds to wait before playing animation
		*/
		// get/set variables to determine animation progress
		let interval = 5;
		let stepCount = (time * 1000) / interval
		let currentStep = 1;

		// get the number of pixels the element should move each interval
		let startPosition = parseFloat(window.getComputedStyle(element)[anchor]);
		let totalDisp = Math.abs(disp);

		setTimeout(run, delay*1000);

		let i;
		function run() {
			i = setInterval(animate, interval);
		}

		// actual animation
		function animate() {

			if (currentStep < stepCount ) {
				// get % of progress as expressed from 0.00 -> 1.00
				let progress = currentStep/stepCount;

				// get timing coefficient as the returned value from any Timing property using progress as the argument.
				let timingCoef = Timing.ease(progress, 3.5);

				// get currentDisp value, which is equal to timingCoef * totalDisp
				let currentDisp = timingCoef * totalDisp;

				element.style[anchor] = `${startPosition + currentDisp}px`;
				currentStep++;
			} else {
				clearInterval(i);
				element.style[anchor] = `${startPosition + totalDisp}px`;
			}
		}
	}
}

export { Animator };
