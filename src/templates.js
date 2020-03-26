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
			<h4>%name</h1>
			<h5>&nbsp&nbsp%clientName</h2>
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
			<h5>%clientName</h5>
			<h6>%projectName</h6>
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
};

export { TEMPLATES };
