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
			let date;
			if (timestamp.toDate) {
				date = timestamp.toDate().toString().split(" ");
			} else {
				date = `${timestamp.toDateString()} ${timestamp.toTimeString()}`.split(" ");
			}
			return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
		} else {
			return "Active";
		}
	}

	static dateForInput(timestamp) {
		let date;
		if (timestamp.toDate) {
			date = timestamp.toDate().toString().split(" ");
		} else {
			date = `${timestamp.toDateString()} ${timestamp.toTimeString()}`.split(" ");
		}
		return `${date[3]}-${Format.getMonthNumber(date[1])}-${date[2]}`;
	}

	static timeForInput(timestamp) {
		let time;
		if (timestamp.toDate) {
			time = timestamp.toDate().toString().split(" ")[4].split(":");
		} else {
			time = `${timestamp.toDateString()} ${timestamp.toTimeString()}`.split(" ")[4].split(":");
		}
		let hours = time[0];
		let minutes = time[1];
		return `${hours}:${minutes}`;
	}

	static secondsToDateTime(secs) {
		if (secs == Number.POSITIVE_INFINITY) {
			return "Job Active";
		} else if (secs == 0) {
			return "-";
		} else {
			var t = new Date(secs * 1000); // Epoch
			var day = t.getUTCDay();
			var year = t.getUTCFullYear();
			var month = t.getUTCMonth();
			var date = t.getUTCDate();
			return `${Format.getDayName(day)}, ${Format.getMonthName(month)} ${date}, ${year}`;
		}
	}

	static time(timestamp) {
		if (timestamp) {
			let time;
			if(timestamp.toDate) {
				time = timestamp.toDate().toString().split(" ")[4].split(":");
			} else {
				time = `${timestamp.toDateString()} ${timestamp.toTimeString()}`.split(" ")[4].split(":");
			}
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
			temp = temp.replace(/%lastClockedIn/g, Format.secondsToDateTime(data.lastAccessed));
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

	static getMonthName(
		num,
		idx = 0 /*Optional Integer: Number that represents January*/,
		long = false /*Optional Boolean: Return full name?*/,
	) {
		num -= idx;
		switch (num) {
			case 0:
				if (long) {
					return "January";
				} else {
					return "Jan";
				}
			case 1:
				if (long) {
					return "February";
				} else {
					return "Feb";
				}
			case 2:
				if (long) {
					return "March";
				} else {
					return "Mar";
				}
			case 3:
				if (long) {
					return "April";
				} else {
					return "Apr";
				}
			case 4:
				return "May";
			case 5:
				if (long) {
					return "June";
				} else {
					return "Jun";
				}
			case 6:
				if (long) {
					return "July";
				} else {
					return "Jul";
				}
			case 7:
				if (long) {
					return "August";
				} else {
					return "Aug";
				}
			case 8:
				if (long) {
					return "September";
				} else {
					return "Sep";
				}
			case 9:
				if (long) {
					return "October";
				} else {
					return "Oct";
				}
			case 10:
				if (long) {
					return "November";
				} else {
					return "Nov";
				}
			case 11:
				if (long) {
					return "December";
				} else {
					return "Dec";
				}
		}
	}

	static getDayName(
		num,
		idx = 0 /*Optional Integer: Int that represents Sunday*/,
		long = false /*Optional Boolean: Return full name?*/,
	) {
		num -= idx;
		switch (num) {
			case 0:
				if (long) {
					return "Sunday";
				} else {
					return "Sun";
				}
			case 1:
				if (long) {
					return "Monday";
				} else {
					return "Mon";
				}
			case 2:
				if (long) {
					return "Tuesday";
				} else {
					return "Tue";
				}
			case 3:
				if (long) {
					return "Wednesday";
				} else {
					return "Wed";
				}
			case 4:
				if (long) {
					return "Thursday";
				} else {
					return "Thu";
				}
			case 5:
				if (long) {
					return "Friday";
				} else {
					return "Fri";
				}
			case 6:
				if (long) {
					return "Saturday";
				} else {
					return "Sat";
				}
		}
	}

	static getTimestamp(inputDate, inputTime) {

		let newDate = inputDate.split("-");
		let newTime = inputTime.split(":");
		let newYear = newDate[0];
		let newMonth = newDate[1] - 1;
		let newDay = newDate[2];
		let newHours = newTime[0];
		let newMins = newTime[1];

		return new Date(newYear, newMonth, newDay, newHours, newMins, 0, 0);
	}
}

export { Format };
