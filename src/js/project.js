class Project {
	constructor(project) {
		this.clientID = project.Client_ID;
		this.description = project.Description;
		this.name = project.Name;
		this.rate = project.Rate;
		this.userID = project.User_ID;
	}

	validate() {
		let errors = [];

		if (this.name == "") {
			errors.push("Project Name Cannot be Blank");
		}

		if (this.clientID == "") {
			errors.push("Please Select a Client");
		}

		return errors;
	}
}

export { Project };
