const TEMPLATES = {
	client: `
		<div class="data-block first-block">
			<h3>%name</h1>
		</div>
		<div class="data-block">
			<p>%lastClockedIn</p>
			<p>%active</p>
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
			<p>%lastClockedIn</p>
			<p>%active</p>
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
			<p>%date</p>
			<p>%duration</p>
		</div>
		<div class="data-block last-block">
			<p>%clockIn</p>
			<p>%clockOut</p>
		</div>
	`,
};

export { TEMPLATES };
