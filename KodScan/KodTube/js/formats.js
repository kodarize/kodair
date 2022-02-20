let formatsSelector = document.querySelector("#formats");

formatsSelector.addEventListener("change", function () {
	if (videoObj == null) {
		return;
	}
	let currVal = formats.value;
	changeVideoSource(videoObj.validVideoFormat[currVal]);
});

function setAvailableFormats() {
	formatsSelector.innerHTML = "";
	for (let i in videoObj.availableFormats) {
		let opt = document.createElement("option");
		opt.value = videoObj.availableFormats[i];

		opt.innerHTML = videoObj.availableFormats[i];
		formatsSelector.appendChild(opt);
	}
}

function setCurrFormatVal(val) {
	formatsSelector.val = val;
}
