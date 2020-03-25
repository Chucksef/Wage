const TEMPLATES = {
	client: `
		<div class="data-block first-block">
			<h3>%name</h1>
		</div>
		<div class="data-block">
			<p>%lastClockedIn</p>
			<p>%active</p>
		</div>
		<div class="data-block">
			<p>%hourlyRate</p>
			<p>%totalHours</p>
		</div>	
	`,

	project: `
		<div class="data-block first-block">
			<h4>%name</h1>
			<h5>%clientName</h2>
		</div>
		<div class="data-block">
			<p>%lastClockedIn</p>
			<p>%active</p>
		</div>
		<div class="data-block">
			<p>%hourlyRate</p>
			<p>%totalHours</p>
		</div>
	`,

	session: `
		<div class="data-block first-block">
			<h4>%duration</h4>
		</div>
		<div class="data-block">
			<p>%clientName</p>
			<p>%projectName</p>
		<div class="data-block">
			<p>%clockIn</p>
			<p>%clockOut</p>
		</div>
	`,
};

export { TEMPLATES };
