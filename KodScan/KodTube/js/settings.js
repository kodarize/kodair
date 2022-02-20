let gear = document.querySelector(".gear");
let optBlc = document.querySelector(".options-block");
let pipE = document.querySelector("#pipEnable");
let captions = document.querySelector("#captions");
let playbackRate = document.querySelector("#playback-rate");

let isPIPE = localStorage.getItem("pipE");
let showCaptions = localStorage.getItem("captions");
let lastCaptionIdx = -1;

playbackRate.value = 1;

// if (isPIPE == "true") isPIPE = true;
// else isPIPE = false;

// if (captions == "true") captions = true;
// else captions = false;

gear.addEventListener("click", handleSettingVisibility);
gear.addEventListener("blur", handleSettingVisibility);

function handleSettingVisibility() {
	if (isSettingVisible) {
		optBlc.style.visibility = "hidden";
		optBlc.style.opacity = 0;
	} else {
		optBlc.style.visibility = "visible";
		optBlc.style.opacity = 1;
	}
	isSettingVisible = !isSettingVisible;
}
function addCaptionsToSelector() {
	if (videoObj) {
		captions.innerHTML = `<option value="off">off</option>`;
		videoPlayer.innerHTML = "";
		let c = 0;
		for (let i in videoObj.subtitle) {
			// adding captions options to setting block
			let opt = document.createElement("option");
			opt.value = c;
			c++;
			opt.textContent = i;
			captions.appendChild(opt);

			// adding subtitle track to player
			let track = document.createElement("track");
			track.kind = "captions";
			track.srclang = i;
			track.mode = "hide";
			for (let x in videoObj.subtitle[i]) {
				if (videoObj.subtitle[i][x]["ext"] == "vtt") {
					let url = videoObj.subtitle[i][x]["url"];
					axios.get(url).then(function (data) {
						let blob = new Blob([data.data], { type: "text/vtt" });

						let newURL = (URL || webkitURL).createObjectURL(blob);
						track.src = newURL;
					});
				}
			}
			videoPlayer.appendChild(track);
		}
	}
}

captions.addEventListener("change", handleCaptions);

function handleCaptions() {
	let val = Number(captions.value);
	// console.log(val);
	if (val >= 0) {
		if (lastCaptionIdx != -1)
			videoPlayer.textTracks[lastCaptionIdx].mode = "disabled";
		videoPlayer.textTracks[val].mode = "showing";
		lastCaptionIdx = val;
	} else {
		videoPlayer.textTracks[lastCaptionIdx].mode = "disabled";
		lastCaptionIdx = -1;
	}
}

playbackRate.addEventListener("change", handlePlaybackRate);

function handlePlaybackRate() {
	let val = Number(playbackRate.value);
	videoPlayer.playbackRate = val;
	audioPlayer.playbackRate = val;
}

// pipE.addEventListener("change", function () {
// 	if (isPIPE) {
// 		videoPlayer.autoPictureInPicture = true;
// 	} else {
// 		videoPlayer.autoPictureInPicture = false;
// 	}
// 	isPIPE = !isPIPE;
// });
