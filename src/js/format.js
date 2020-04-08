class Format {
	static dollars(num) {
		let split = num.toString().split(".");
		if (split.length == 1) {
			return `$${num}.00`;
		} else {
			let oldPrefix = split[0];
			let newPrefix = "";
			for (let i = oldPrefix.length - 1, j = 1; i >= 0; i--, j++) {
				// append first
				newPrefix = `${oldPrefix[i]}${newPrefix}`;
				// if idx/3 gives no remainder, append a comma...
				if (j % 3 == 0 && i != 0) {
					newPrefix = `,${newPrefix}`;
				}
			}
			return `$${newPrefix}.${(split[1] + "00").substr(0, 2)}`;
		}
	}

	static date(timestamp) {
		if (timestamp) {
			let date = timestamp.toDate().toString().split(" ");
			return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
		} else {
			return "Active";
		}
	}

	static dateForInput(timestamp) {
		let date = timestamp.toDate().toString().split(" ");
		return `${date[3]}-${Format.getMonthNumber(date[1])}-${date[2]}`;
	}

	static timeForInput(timestamp) {
		let time = timestamp.toDate().toString().split(" ")[4].split(":");
		let hours = parseInt(time[0]);
		let minutes = time[1];
		return `${hours}:${minutes}`;
	}

	static time(timestamp) {
		if (timestamp) {
			let time = timestamp.toDate().toString().split(" ")[4].split(":");
			let hours = parseInt(time[0]);
			let minutes = time[1];
			let ampm = "AM";

			if (hours > 11) {
				ampm = "PM";
			}
			if (hours > 12) {
				hours = hours - 12;
			}

			return `${hours}:${minutes} ${ampm}`;
		} else {
			return "Job Active";
		}
	}

	static round(num, decimals) {
		let zeroes = "1";
		for (let i = 0; i < decimals; i++) {
			zeroes += "0";
		}
		zeroes = parseInt(zeroes);

		num = Math.round(num * zeroes);
		return num / zeroes;
	}

	static template(app, data) {
		/*
			Format.template takes an app and a CPS object (with a 
			.template property) and returns a template-string
			with all of its fields correctly filled in.
		*/

		let temp = data.template;

		if (temp.includes("%name")) {
			temp = temp.replace(/%name/g, data.name);
		}
		if (temp.includes("%clientName")) {
			temp = temp.replace(/%clientName/g, data.clientName);
		}
		if (temp.includes("%projectName")) {
			temp = temp.replace(/%projectName/g, data.projectName);
		}
		if (temp.includes("%lastClockedIn")) {
			temp = temp.replace(/%lastClockedIn/g, Format.date(app.getLastDate(data)));
		}
		if (temp.includes("%rate")) {
			temp = temp.replace(/%rate/g, `${Format.dollars(data.rate)} / hr`);
		}
		if (temp.includes("%totalHours")) {
			temp = temp.replace(/%totalHours/g, `${Format.round(data.totalHours, 2)} hrs`);
		}
		if (temp.includes("%duration")) {
			temp = temp.replace(/%duration/g, `${Format.round(data.duration, 2)} hrs`);
		}
		if (temp.includes("%breaks")) {
			temp = temp.replace(/%breaks/g, `${data.breaks} hrs`);
		}
		if (temp.includes("%date")) {
			temp = temp.replace(/%date/g, Format.date(data.clockOut));
		}
		if (temp.includes("%clockIn")) {
			temp = temp.replace(/%clockIn/g, Format.time(data.clockIn));
		}
		if (temp.includes("%clockOut")) {
			temp = temp.replace(/%clockOut/g, Format.time(data.clockOut));
		}

		return temp;
	}

	static secondsToHours(sec) {
		let hh = Math.floor(sec / 3600);
		let mm = Math.floor((sec - hh * 3600) / 60);
		let ss = sec - (hh * 3600 + mm * 60);

		return `${Format.padZeroes(hh, 2)}:${Format.padZeroes(mm, 2)}:${Format.padZeroes(ss, 2)}`;
	}

	static padZeroes(num, desiredLength) {
		let currentLength = num.toString().length;
		if (currentLength >= desiredLength) {
			return num;
		} else {
			let digitsNeeded = desiredLength - currentLength;
			let string = num.toString();
			for (let i = 0; i < digitsNeeded; i++) {
				string = `0${string}`;
			}
			return string;
		}
	}

	static getMonthNumber(string) {
		string = string.toLowerCase();
		switch (string) {
			case "jan":
			case "january":
				return Format.padZeroes(1, 2);
				break;
			case "feb":
			case "february":
				return Format.padZeroes(2, 2);
				break;
			case "mar":
			case "march":
				return Format.padZeroes(3, 2);
				break;
			case "apr":
			case "april":
				return Format.padZeroes(4, 2);
				break;
			case "may":
				return Format.padZeroes(5, 2);
				break;
			case "jun":
			case "june":
				return Format.padZeroes(6, 2);
				break;
			case "jul":
			case "july":
				return Format.padZeroes(7, 2);
				break;
			case "aug":
			case "august":
				return Format.padZeroes(8, 2);
				break;
			case "sep":
			case "sept":
			case "september":
				return Format.padZeroes(9, 2);
				break;
			case "oct":
			case "october":
				return "10";
				break;
			case "nov":
			case "november":
				return "11";
				break;
			case "dec":
			case "december":
				return "12";
				break;
		}
	}
}

export { Format };
