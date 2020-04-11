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
		let interval = 5;
		let stepCount = (time * 1000) / interval

		// get the number of pixels the element should move each interval
		let stepDisp = disp / stepCount;
		let currentDisp = 0;
		let maxDisp = Math.abs(disp);

		setTimeout(run, delay*1000);

		let i;
		function run() {
			i = setInterval(animate, interval);
		}

		// actual animation
		function animate() {
			let currentPos = parseFloat(window.getComputedStyle(element)[anchor]);

			if (currentDisp < (maxDisp-.1) ) {
				element.style[anchor] = `${currentPos + stepDisp}px`;
				currentDisp += Math.abs(stepDisp);
			} else {
				clearInterval(i);
				element.style[anchor] = "";
			}
		}
	}
}

export { Animator };
