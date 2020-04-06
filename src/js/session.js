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
