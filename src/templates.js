const TEMPLATES = {
	entries: {
		client: `
			<div class="data-block first-block">
				<h6 class="tag">Client</h6>
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
				<h6 class="tag">Project</h6>
				<h4>%name</h4>
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
				<h6 class="tag">Session</h6>
				<h4>%date</h4>
			</div>
			<div class="data-block">
				<p>Time: %duration</p>
				<p>Breaks: %breaks</p>
			</div>
			<div class="data-block last-block">
				<p>%clockIn</p>
				<p>%clockOut</p>
			</div>
		`,
	},

	menus: {
		client: `
			<!--CLIENT-->
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
				<input type="text" id="client-email" placeholder="Contact Email">
				<input type="text" id="client-phone" placeholder="Contact Phone">
				<h6>Details</h6>
				<input type="text" id="client-rate" placeholder="Hourly Rate">
				<select id="client-frequency">
					<option value="" selected disabled hidden>Select Invoice Frequency</option>
					<option value="weekly">Weekly</option>
					<option value="bi-weekly">Bi-Weekly</option>
					<option value="monthly">Monthly</option>
				</select>
				<textarea id="client-notes" placeholder="Notes"></textarea>
				<button type="button" class="btn-block" id="submit">Add Client</button>
				<button type="button" class="btn-icon" id="back">
					<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
						viewBox="0 0 318 318" style="enable-background:new 0 0 318 318;" xml:space="preserve">
					<g>
						<path class="st0" d="M315,159c0,41.2-15.9,78.6-42,106.5C244.5,296,204,315,159,315s-85.5-19-114-49.5C18.9,237.6,3,200.2,3,159
							C3,72.8,72.8,3,159,3S315,72.8,315,159z"/>
						<g>
							<g>
								<g>
									<polygon class="st1" points="283,143 283,175 131.7,175 131.7,214.8 35,159 131.7,103.2 131.7,143 				"/>
								</g>
							</g>
						</g>
					</g>
					</svg>				
				</button>
			</div>
		`,

		project: `
			<!--PROJECT-->
			<div class="menu">
				<h1>New Project</h1>
				<input type="text" id="project-name" placeholder="Name">
				<textarea id="project-description" placeholder="Description"></textarea>
				<h6>Client</h6>
				<select id="client-ID">
				</select>
				<h6>Details</h6>
				<input type="text" id="project-rate" placeholder="Project Hourly Rate">
				<button type="button" class="btn-block" id="submit">Add Project</button>
				<button type="button" class="btn-icon" id="back">
					<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
						viewBox="0 0 318 318" style="enable-background:new 0 0 318 318;" xml:space="preserve">
					<g>
						<path class="st0" d="M315,159c0,41.2-15.9,78.6-42,106.5C244.5,296,204,315,159,315s-85.5-19-114-49.5C18.9,237.6,3,200.2,3,159
							C3,72.8,72.8,3,159,3S315,72.8,315,159z"/>
						<g>
							<g>
								<g>
									<polygon class="st1" points="283,143 283,175 131.7,175 131.7,214.8 35,159 131.7,103.2 131.7,143 				"/>
								</g>
							</g>
						</g>
					</g>
					</svg>				
				</button>
			</div>
		`,
	},
};

export { TEMPLATES };
