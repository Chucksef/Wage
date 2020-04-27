const TEMPLATES = {
	entries: {
		client: `
			<div class="data-block first-block">
				<div class="tag"></div>
				<h3>%name</h3>
			</div>
			<div class="data-block">
				<p>Last:</p>
				<p>%lastClockedIn</p>
			</div>
			<div class="data-block last-block">
				<p>%rate</p>
				<p>%totalHours</p>
			</div>	
		`,

		project: `
			<div class="data-block first-block">
				<div class="tag"></div>
				<h4>%name</h4>
			</div>
			<div class="data-block">
				<p>Last:</p>
				<p>%lastClockedIn</p>
			</div>
			<div class="data-block last-block">
				<p>%rate</p>
				<p>%totalHours</p>
			</div>
		`,

		session: `
			<div class="data-block first-block">
				<div class="tag"></div>
				<h4>%date</h4>
			</div>
			<div class="data-block session-block">
				<p>Time: %duration</p>
				<p>Breaks: %breaks</p>
			</div>
		`,
	},

	menus: {
		client: `
			<!--CLIENT-->
			<div class="menu" id="client-menu">
				<h1>New Client</h1>
				<hr>
				<h6>Client Info</h6>
				<input type="text" class="first" id="client-name" placeholder="Client Name">
				<input type="text" id="client-address" placeholder="Address">
				<input type="text" id="client-city" placeholder="City">
				<input type="text" id="client-state" placeholder="State">
				<input type="text" id="client-zip" placeholder="Zip">
				<input type="text" id="client-country" placeholder="Country">
				<textarea id="client-notes" placeholder="Notes"></textarea>
				<h6>Contact Info</h6>
				<input type="text" id="client-contact" placeholder="Contact Name">
				<input type="text" id="client-email" placeholder="Contact Email">
				<input type="text" id="client-phone" placeholder="Contact Phone">
				<h6>Payment Info</h6>
				<input type="text" id="client-rate" placeholder="Hourly Rate">
				<select id="client-frequency">
					<option value="" selected disabled hidden>Select Invoice Frequency</option>
					<option value="weekly">Weekly</option>
					<option value="bi-weekly">Bi-Weekly</option>
					<option value="monthly">Monthly</option>
				</select>
				<hr>
				<div class="buttonRow">
					<div class="buttons">
						<button type="button" class="btn-menu material-icons" id="submit">
							save
							<p class="tooltip right">Save</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="back">
							undo
							<p class="tooltip left">Back</p>
						</button>
					</div>
				</div>
			</div>
		`,

		project: `
			<!--PROJECT-->
			<div class="menu" id="project-menu">
				<h1>New Project</h1>
				<hr>
				<h6>Client</h6>
				<select class="first" id="client-ID">
				</select>
				<h6>Details</h6>
				<input type="text" id="project-name" placeholder="Name">
				<textarea id="project-description" placeholder="Description"></textarea>
				<input type="text" id="project-rate" placeholder="Project Hourly Rate*">
				<p><small>*Defaults to Client Rate if Left Blank</small></p>
				<hr>
				<div class="buttonRow">
					<div class="buttons">
						<button type="button" class="btn-menu material-icons" id="submit">
							save
							<p class="tooltip right">Save</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="back">
							undo
							<p class="tooltip left">Back</p>
						</button>
					</div>
				</div>
			</div>
		`,

		session: `
			<!--SESSION-->
			<div class="menu" id="session-menu">
				<h1>Save Session</h1>
				<h3>%clientName</h3>
				<h5>%projectName</h5>
				<hr>
				<div class="row">
					<div class="col">
						<h6>Clock In</h6>
						<input type="date" class="first" id="session-clockInDate">
						<input type="time" id="session-clockInTime">
					</div>
					<div class="col">
						<h6>Clock Out</h6>
						<input type="date" id="session-clockOutDate">
						<input type="time" id="session-clockOutTime">
					</div>
				</div>
				<h6>Breaks (hours)</h6>
				<input type="number" id="session-breaks" placeholder="0 (hours)">
				<hr>
				<div class="buttonRow">
					<div class="buttons">
						<button type="button" class="btn-menu material-icons" id="submit">
							save
							<p class="tooltip right">Update Session</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="cancel">
							delete_forever
							<p class="tooltip top">Discard Session</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="back">
							undo
							<p class="tooltip left">Back</p>
						</button>
					</div>
				</div>
			</div>
		`,

		delete: `
			<!--DELETE-->
			<div class="menu" id="delete-menu">
				<h1>Delete %type?</h1>
				<hr>
				<p>Are you sure you want to delete this item?</p>
				<h3><b>WARNING:</b></h3>
				<p>Deleting an item cannot be undone, and doing so will</p>
				<p>also delete any items contained within it!</p>
				<hr>
				<div class="buttonRow">
					<div class="buttons">
						<button type="button" class="btn-menu material-icons first" id="submit">
							delete_forever
							<p class="tooltip right">Delete Forever</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="cancel">
							undo
							<p class="tooltip left">Back</p>
						</button>
					</div>
				</div>
			</div>
		`,

		signIn: `
			<!--SIGNIN-->
			<div class="menu" id="signin-menu">
				<h1>Sign In</h1>
				<hr>
				<label>Email</label>
				<input type="email" class="first" id="signIn-email" placeholder="User Email" required>
				<label>Password</label>
				<input type="password" id="signIn-password" placeholder="Password" required>
				<hr>
				<div class="buttonRow">
					<div class="buttons">
						<button type="button" class="btn-menu material-icons" id="submit">
							check
							<p class="tooltip right">Sign In</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="reset">
							cached
							<p class="tooltip top">Reset Password</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="cancel">
							undo
							<p class="tooltip left">Back</p>
						</button>
					</div>
				</div>
			</div>
		`,

		signUp: `
			<!--SIGNUP-->
			<div class="menu" id="signup-menu">
				<h1>Sign Up</h1>
				<hr>
				<label>Email</label>
				<input type="email" class="first" id="signUp-email" placeholder="User Email" required>
				<label>Password</label>
				<input type="password" id="signUp-password" placeholder="Password" required>
				<label>Confirm Password</label>
				<input type="password" id="signUp-confirmation" placeholder="Confirm Password" required>
				<hr>
				<div class="buttonRow">
					<div class="buttons">
						<button type="button" class="btn-menu material-icons" id="submit">
							check
							<p class="tooltip right">Create New Profile</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="cancel">
							undo
							<p class="tooltip left">Back</p>
						</button>
					</div>
				</div>
			</div>
		`,

		user: `
			<!--USER-->
			<div class="menu" id="user-menu">
				<h1>User Profile</h1>
				<hr>
				<label>User Name</label>
				<input type="text" class="first" id="user-name" placeholder="User Name" required>
				<label>Primary Email Address</label>
				<input type="email" id="user-email" placeholder="User Email" required>	
				<label>Password</label>
				<input type="password" id="user-password" placeholder="Required" required>
				<hr>
				<div class="buttonRow">
					<div class="buttons">
						<button type="button" class="btn-menu material-icons" id="submit">
							check
							<p class="tooltip right">Update User Profile</p>
						</button>
						<button type="button" class="btn-menu material-icons" id="cancel">
							undo
							<p class="tooltip left">Back</p>
						</button>
					</div>
				</div>
			</div>
		`,
	},

	clock: `
		<h3>00:00:00</h3>
		<hr>
		<h6><b>%clientName</b></h6>
		<p>%projectName</p>
	`,

	tutorial: `
		<div id="highlight"></div>
		<div id="msg">First, create a new CLIENT</div>
		<button>Skip >></button>
	`,
};

export { TEMPLATES };
