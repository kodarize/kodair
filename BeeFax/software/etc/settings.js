////////////////////////////////////////////////////////////////////////////////
// BEEFAX // ETC: SETTINGS                                                    //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Get Coords
fetch("https://ipapi.co/json/")
.then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("NETWORK RESPONSE ERROR");
    }
})
.then(data => {
    console.log(data);
    const xxx = data.latitude
    const yyy = data.longitude
}).catch(function() {
    console.error("FETCH ERROR:", error);
});

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
        lat: xxx,
        lon: yyy
    }

};