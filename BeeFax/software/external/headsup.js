////////////////////////////////////////////////////////////////////////////////
// BEEFAX // EXTERNAL: HEADS UP                                               //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External Def: Geolocation data.
let geoLocation = { successful: true, failReason: "", lat: null, lon: null, rlat: 0, rlon: 0, gridx: 0, gridy: 0 };
let weatherUrls = { forecast: "", observation: "", observationBackup: "" };

// Class.
class ExternalHeadsUp {

	// Geolocation performer.
	static performGeolocation() {

		// Load & verify settings.
		let loadedLat = defaultSetting(localStorage.getItem("location.lat"), defaults.location.lat);
		let loadedLon = defaultSetting(localStorage.getItem("location.lon"), defaults.location.lon);
		let loadVerify = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
		if (!(loadVerify.test(loadedLat) && loadVerify.test(loadedLon))) {
			geoLocation.successful = false;
			geoLocation.failReason = "Invalid location settings.\nPlease check your latitude and longitude in setup.";
			return;
		}

		// Store lat & Long.
		geoLocation.lat = loadedLat;
		geoLocation.lon = loadedLon;
		geoLocation.rlat = Math.round(geoLocation.lat*100)/100;
		geoLocation.rlon = Math.round(geoLocation.lon*100)/100;

		// Search for grid position & URLs.
		getJSON(`https://api.weather.gov/points/${geoLocation.lat},${geoLocation.lon}`, {}).then((gridData) => {

			// Store grid X & Y position.
			geoLocation.gridx = gridData.properties.gridX;
			geoLocation.gridy = gridData.properties.gridY;

			// Store forecast URL.
			weatherUrls.forecast = gridData.properties.forecast;

			// Get observation URL.
			getJSON(gridData.properties.observationStations, {}).then((stationData) => {

				// Generate URLs.
				weatherUrls.observation = `${stationData.observationStations[0]}/observations/latest`;
				if (stationData.observationStations.length > 1) {
					weatherUrls.observationBackup = `${stationData.observationStations[1]}/observations/latest`;
				} else {
					weatherUrls.observationBackup = weatherUrls.observation;
				}

				// Report success.
				geoLocation.successful = true;
				geoLocation.failReason = "";

			// Report observation URL failure.
			}, () => {
				geoLocation.successful = false;
				geoLocation.failReason = "Cannot get observation URL.\nPlease check for connection errors to api.weather.gov.";
				return;
			});

		// Report grid positioning failure.
		}, () => {
			geoLocation.successful = false;
			geoLocation.failReason = "Cannot get grid position.\nPlease check for connection errors to api.weather.gov.";
			return;
		});
		
	}

	// Moon phase.
	// Modified from: https://gist.github.com/endel/dfe6bb2fbe679781948c#gistcomment-2811037
	static getMoonPhase(year, month, day) {

		const phases = ['New Moon', 'Waxing Crescent', 'Quarter Moon', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter Moon', 'Waning Crescent'];

		let c = 0; let e = 0; let jd = 0; let b = 0;
		if (month < 3) { year--; month += 12; }

		month++;
		c = 365.25 * year;
		e = 30.6 * month;
		jd = c + e + day - 694039.09; // jd is total days elapsed
		jd /= 29.5305882; // divide by the moon cycle
		b = parseInt(jd); // int(jd) -> b, take integer part of jd
		jd -= b; // subtract integer part to leave fractional part of original jd
		b = Math.round(jd * 8); // scale fraction from 0-8 and round

		if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0
		return phases[b];

	}

	// Degrees C to F.
	static degCtoF(degC) {
		return Math.round((degC * 1.8) + 32);
	}

	// Kph to Mph.
	static KPHtoMPH(KPH) {
		return Math.round(KPH * 0.6213711922);
	}

	// Deg to Card.
	// Source: https://gist.github.com/basarat/4670200#gistcomment-2067650
	static DEGtoCARD(DEG) {
		if (typeof DEG === 'string') DEG = parseInt(DEG);
		if (DEG <= 0 || DEG > 360 || typeof DEG === 'undefined') return '☈';
		const arrows = { north: 'C N', north_east: 'F NE', east: 'B E', south_east: 'G SE', south: 'D S', south_west: 'H SW', west: 'A W', north_west: 'E NW' };
		const directions = Object.keys(arrows);
		const degree = 360 / directions.length;
		DEG = DEG + degree / 2;
		for (let i = 0; i < directions.length; i++) {
			if (DEG >= (i * degree) && DEG < (i + 1) * degree) return arrows[directions[i]];
		}
		return arrows['north'];
	}

	// Weather icon translator.
	static getIcon(condition) {

		// Initialize variables.
		condition = condition.toLowerCase();
		let conditions = [condition];

		// Split up condition by "then" statements.
		if (condition.includes(" then ")) {
			let newConditions = [];
			conditions.forEach((cCondition) => {
				cCondition.split(" then ").forEach((dCondition) => {
					newConditions.push(dCondition);
				});
			});
			conditions = newConditions;
		}

		// Split up condition by "and" statements.
		if (condition.includes(" and ")) {
			let newConditions = [];
			conditions.forEach((cCondition) => {
				cCondition.split(" and ").forEach((dCondition) => {
					newConditions.push(dCondition);
				});
			});
			conditions = newConditions;
		}

		// Perform translation.
		let result = [];
		conditions.forEach((cCondition) => {

			// Conditions.
			let icon = "Custom:";
			if (cCondition.includes("sun")) {
				icon += "J";
			} else if (cCondition.includes("clear")) {
				icon += "K";
			} else if (cCondition.includes("cloud")) {
				icon += "L";
			} else if (cCondition.includes("rain")) {
				icon += "M";
			} else if (cCondition.includes("snow")) {
			    icon += "N";
			} else if (cCondition.includes("sleet")) {
				icon += "P";
			} else if (cCondition.includes("thunder")) {
				icon += "Q";
			} else if (cCondition.includes("shower")) {
				icon += "R";
			} else {
				icon += "O";
			}

			// Update result.
			result.push(icon);

		});

		// Return.
		return result;

	}

	// "Right now" write.
	static writeNow(title, temp, tempCode, wind, windCode, windDir, humid) {

		// Format data.
		if (title.includes(" and ")) {
			let titles = title.split(" and ");
			if (updateToggle) {
				title = `...${titles[1]==null ? "Unknown" : titles[1]} -`;
			} else {
				title = `- ${titles[0]==null ? "Unknown" : titles[0]}...`;
			}
		} else {
			title = `- ${title==null ? "Unknown" : title} -`;
		}
		temp = (temp==null ? "..." : (tempCode=="wmoUnit:degC" ? ExternalHeadsUp.degCtoF(temp) : Math.round(temp))) + " F";
		let windCard = ExternalHeadsUp.DEGtoCARD(windDir);
		wind = (wind===null ? "..." : (windCode=="wmoUnit:km_h-1" ? ExternalHeadsUp.KPHtoMPH(wind) : Math.round(wind))) + "mph " + windCard;
		humid = (humid==null ? "..." : Math.round(humid)) + "% Humid";

		// Title.
		BufferInterface.writeString(title, 16, (consoleSize.columns-28)+Math.floor(((27-title.length)/2)));

		// Temperature.
		BufferInterface.writeString(temp, 17, (consoleSize.columns-28)+Math.floor(((27-temp.length)/2)));
		BufferInterface.placeIcon(17, (consoleSize.columns-28)+Math.floor(((27-temp.length)/2))+temp.length-2, "Custom:I")

		// Wind.
		BufferInterface.writeString(wind, 18, (consoleSize.columns-28)+Math.floor(((27-wind.length)/2)));
		BufferInterface.placeIcon(18, (consoleSize.columns-28)+Math.floor(((27-wind.length)/2))+wind.length-windCard.length, `Custom:${windCard[0]}`);

		// Humidity.
		BufferInterface.writeString(humid, 19, (consoleSize.columns-28)+Math.floor(((27-humid.length)/2)));

	}

	// Periodic update function.
	static periodicUpdate() {

		// Quit if incorrect menu.
		if (menuName != "headsup") return;

		// Retry geolocation if none loaded or failed.
		if (
			(location.lat == null && location.lon == null) ||
			(!geoLocation.successful)
		) {
			ExternalHeadsUp.performGeolocation();
		}

		// Display error if geolocation fails.
		if (!geoLocation.successful) {

			// Clear everything.
			BufferInterface.fillText(3, 1, consoleSize.columns-2, 10, " ", 15);
			BufferInterface.fillText(15, 1, 15, 6, " ", 21);
			BufferInterface.fillText(15, (consoleSize.columns-28), 27, 6, " ", 15);

			// Write error message.
			BufferInterface.writeString("An error occurred.", 4, 3);
			let errorReason = formatTextWrap(`Reason: ${geoLocation.failReason}`, consoleSize.columns-6);
			for (let index = 0; index < errorReason.length; index++) {
				BufferInterface.writeString(errorReason[index], 6+index, 3);
			}

			// Quit.
			return;

		}

		// Display footer.
		BufferInterface.fillText(consoleSize.rows-2, 10, consoleSize.columns, 1, " ", 25);
		let footer = (!updateToggle ? `Location: ${geoLocation.rlat} ${geoLocation.rlon}` : "(Data from api.weather.gov)");
		BufferInterface.writeString(footer, consoleSize.rows-2, consoleSize.columns-1-footer.length);

		// Get forecast.
		getJSON(weatherUrls.forecast, {}).then(data => {

			// Quit if incorrect menu.
			if (menuName != "headsup") return;

			// Clear previous data.
			BufferInterface.fillText(3, 1, consoleSize.columns-2, 10, " ", 15);

			// Display forecast.
			let forecast = data.properties.periods;
			let forecastLength = (forecast.length<=5? forecast.length : 5);
			for (let index = 0; index < forecastLength; index++) {

				// Load data.
				let row = (index*2)+3;
				let data = forecast[index];
				let day = `[${data.name}]`;
				let temp = `${Math.round(data.temperature)}${data.temperatureUnit}`;
				let titles = data.shortForecast.split(" then ");
				let ticker = (titles.length>1 ? `(${updateToggle ? "2" : "1"}/2)`: "");
				let title = (titles.length>1&&updateToggle ? titles[1] : titles[0]).substr(0, consoleSize.columns-2);
				let icons = ExternalHeadsUp.getIcon(title);

				// Dots.
				for (let column=1; column<consoleSize.columns-2; column++) {
					BufferInterface.placeText(row, column, ".");
				}
				
				// Day.
				BufferInterface.writeString(day, row, 1);

				// Ticker.
				if (ticker.length>0) BufferInterface.writeString(ticker, row, day.length+2)

				// Temperature.
				BufferInterface.writeString(temp, row, consoleSize.columns-1-temp.length);

				// Weather icons.
				icons.forEach((icon, offset) => {
					BufferInterface.placeIcon(row+1, 1+offset, icon);
				})

				// Weather title.
				BufferInterface.writeString(`${title}`, row+1, consoleSize.columns-1-title.length);

			}

		});

		// Get date & time.
		let now = new Date();
		let dotw = `[ ${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now)} ]`;
		let date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: '2-digit' }).format(now);
		let time = new Intl.DateTimeFormat('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(now);
		let moon = ExternalHeadsUp.getMoonPhase(now.getFullYear(), now.getMonth(), now.getDate());

		// Write date & time.
		BufferInterface.fillText(15, 1, 15, 6, " ", 21);
		BufferInterface.writeString(dotw, 15, Math.floor(((17-dotw.length)/2)));
		BufferInterface.writeString(date, 17, Math.floor(((17-date.length)/2)));
		BufferInterface.writeString(time, 18, Math.floor(((17-time.length)/2)));
		BufferInterface.writeString(moon, 19, Math.floor(((17-moon.length)/2)));

		// Get current conditions.
		getJSON(weatherUrls.observation, {}).then(data => {

			// Quit if incorrect menu.
			if (menuName != "headsup") return;

			// Clear previous data.
			BufferInterface.fillText(15, (consoleSize.columns-28), 27, 6, " ", 15);

			// Load data.
			data = data.properties;
			let title = data.textDescription;
			let temp = data.temperature.value;
			let tempCode = data.temperature.unitCode;
			let wind = data.windSpeed.value;
			let windCode = data.windSpeed.unitCode;
			let windDir = data.windDirection.value;
			let humid = data.relativeHumidity.value;

			// Load backup data.
			if (title==null || temp==null || wind==null || windDir==null || humid==null) { getJSON(weatherUrls.observationBackup, {}).then(backupData => {

				// Quit if incorrect menu.
				if (menuName != "headsup") return;

				// Perform load.
				backupData = backupData.properties;
				if (title==null) title = backupData.textDescription;
				if (temp==null) temp = backupData.temperature.value;
				if (wind==null) wind = backupData.windSpeed.value;
				if (windDir==null) windDir = backupData.windDirection.value;
				if (humid==null) humid = backupData.relativeHumidity.value;

				// Write data to screen.
				ExternalHeadsUp.writeNow(title, temp, tempCode, wind, windCode, windDir, humid);
			}); } else {
				ExternalHeadsUp.writeNow(title, temp, tempCode, wind, windCode, windDir, humid);
			}

		});
	}

}