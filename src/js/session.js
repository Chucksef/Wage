class Session {
	constructor(session) {
		this.breaks = session.Breaks;
		this.clockIn = session.Clock_In;
		this.clockOut = session.Clock_Out;
		this.projectID = session.Project_ID;
		this.userID = session.User_ID;
	}
}

export { Session };


			// let errors = this.session[hash].validate();
			// if (errors.length > 0) {
			// 	// show warning
			// 	let message = "";
			// 	errors.forEach((error) => {
			// 		message += `• ${error}\n`;
			// 	});
			// 	delete this.session[hash];

			// 	UI.toast(message);
			// } else 