class Client {
	constructor(client) {
		this.address = client.Address;
		this.city = client.City;
		this.contactName = client.Contact;
		this.country = client.Country;
		this.email = client.Email;
		this.invoiceFrequency = client.Invoice_Frequency;
		this.name = client.Name;
		this.notes = client.Notes;
		this.phone = client.Phone;
		this.rate = client.Rate;
		this.state = client.State;
		this.zip = client.Zip;
	}

	validate() {
		let errors = [];
		let email = this.email.match(/\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/)[0];

		if (this.name == "") {
			errors.push("Client Name Cannot be Blank");
		}

		if (this.rate == "" || parseFloat(this.rate) == NaN) {
			errors.push("Rate Must be a Valid Number");
		}

		if (this.contactName == "") {
			errors.push("Must Include a Contact Name");
		}

		if (email.length < 6) {
			errors.push("Must Include a Valid Contact Email Address");
		}

		if (this.invoiceFrequency == "") {
			errors.push("Must Choose the Invoicing Frequency");
		}

		return errors;
	}
}

export { Client };
