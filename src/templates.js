const TEMPLATES = {
	entries: {
		client: `
			<div class="data-block first-block">
				<h3>%name</h1>
			</div>
			<div class="data-block">
				<p>Last Session:</p>
				<p>%lastClockedIn</p>
			</div>
			<div class="data-block last-block">
				<p>%rate</p>
				<p>%totalHours</p>
			</div>	
		`,

		project: `
			<div class="data-block first-block">
				<h4>%name</h4>
				<h6>&nbsp&nbsp%clientName</h6>
			</div>
			<div class="data-block">
				<p>Last Session:</p>
				<p>%lastClockedIn</p>
			</div>
			<div class="data-block last-block">
				<p>%rate</p>
				<p>%totalHours</p>
			</div>
		`,

		session: `
			<div class="data-block first-block">
				<h4>%clientName</h4>
				<h6>&nbsp&nbsp%projectName</h6>
			</div>
			<div class="data-block">
				<p>%duration</p>
				<p>%date</p>
			</div>
			<div class="data-block last-block">
				<p>%clockIn</p>
				<p>%clockOut</p>
			</div>
		`,
	},

	menus: {
		client: `
			<div class="menu">
				<h1>New Client</h1>
				<input type="text" id="client-name" placeholder="Client Name">
				<input type="text" id="client-address" placeholder="Address">
				<input type="text" id="client-city" placeholder="City">
				<input type="text" id="client-state" placeholder="State">
				<input type="text" id="client-zip" placeholder="Zip">
				<input type="text" id="client-country" placeholder="Country">
				<h6>Contact Info</h6>
				<input type="text" id="client-contact" placeholder="Contact Name">
				<input type="email" id="client-email" placeholder="Contact Email">
				<input type="text" id="client-phone" placeholder="Contact Phone">
				<h6>Details</h6>
				<input type="text" id="client-rate" placeholder="Hourly Rate">
				<select id="client-frequency">
					<option value="none" selected disabled hidden>Invoice Frequency</option>
					<option value="weekly">Weekly</option>
					<option value="bi-weekly">Bi-Weekly</option>
					<option value="monthly">Monthly</option>
				</select>
				<hr>
				<textarea id="client-notes" placeholder="Notes"></textarea>
				<hr>
				<button type="button" id="submit">Add Client</button>
			</div>
		`,

		project: `
			<div class="menu">
				<h1>New Project</h1>
				<input type="text" id="project-name" placeholder="Name">
				<textarea id="project-description" placeholder="Description"></textarea>
				<h6>Client</h6>
				<select id="client-ID">
				</select>
				<h6>Details</h6>
				<input type="text" id="project-rate" placeholder="Project Hourly Rate">
				<hr>
				<button type="button" id="submit">Add Project</button>
			</div>
		`,
	},
};

export { TEMPLATES };
