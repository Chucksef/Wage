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
		let regName = /^[a-zA-Z-']+[ ]*[a-zA-Z-']*[ ]*[a-zA-Z-']*[ ]*[a-zA-Z-']*$/
		let errors = [];
		let email;
		
		if (this.name == "") {
			errors.push("Client name cannot be blank");
		}

		if (!regName.test(this.name)) {
			errors.push("Client name must not contain any numbers or special characters");
		}
		
		if (this.contactName == "") {
			errors.push("Must include a contact name");
		}
		
		if (this.rate == "" || parseFloat(this.rate) == NaN) {
			errors.push("Rate must be a valid number");
		}
		
		if (this.email) {
			email = this.email.match(/\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/)[0];
			if (email.length < 6) errors.push("Must include a valid contact email address");
		} else {
			errors.push("Must include a valid contact email address")
		}

		if (this.invoiceFrequency == "") {
			errors.push("Must choose the invoicing frequency");
		}

		return errors;
	}
}

export { Client };
