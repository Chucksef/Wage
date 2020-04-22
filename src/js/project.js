class Project {
	constructor(project) {
		this.clientID = project.Client_ID;
		this.description = project.Description;
		this.name = project.Name;
		this.rate = project.Rate;
		this.userID = project.User_ID;
	}

	validate() {
		let regNum = /^[0-9]+([.][0-9]{1,2})?$/;
		let errors = [];

		if (this.name == "") {
			errors.push("Project Name Cannot be Blank");
		}

		if (this.clientID == "") {
			errors.push("Please Select a Client");
		}

		if (this.rate != "") {
			if (!regNum.test(this.rate)) {
				errors.push("Rate must take the format: \"NN.NN\"");
			}
		}

		return errors;
	}
}

export { Project };
