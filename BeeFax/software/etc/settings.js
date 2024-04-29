////////////////////////////////////////////////////////////////////////////////
// BEEFAX // ETC: SETTINGS                                                    //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Setting defaulter.
function defaultSetting(rawSetting, defaultOption = "") {
    if (rawSetting == null) {
        return defaultOption;
    } else {
        return rawSetting;
    }
}

// Default setting data.
const defaults = {
    // Location.
    location: {
        lat: defaultSetting(null, 40.4444), // Default latitude
        lon: defaultSetting(null, -86.9256) // Default longitude
    }
};

function startWeather() {
    return fetch("http://ipwho.is")
    .then(response => {
        if (!response.ok) {
            throw new Error("NETWORK RESPONSE ERROR");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        defaults.location.lat = data.latitude;
        defaults.location.lon = data.longitude;
        console.log("Default location set: ", defaults.location);
        return { lat: defaults.location.lat, lon: defaults.location.lon };
    })
    .catch(error => {
        console.error("FETCH ERROR:", error);
        console.log("Using default location:", defaults.location);
        return { lat: defaults.location.lat, lon: defaults.location.lon };
    });
}

// Call startWeather asynchronously and handle the result
startWeather().then(location => {
    console.log("Latitude:", location.lat);
    console.log("Longitude:", location.lon);
}).catch(error => {
    console.error("Error occurred:", error);
});