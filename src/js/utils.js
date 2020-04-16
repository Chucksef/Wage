class Utils {
	static clearListeners(elem) {
		let newElem = elem.cloneNode(true);
		elem.parentNode.replaceChild(newElem, elem);
		return newElem;
	}
}

export { Utils };
