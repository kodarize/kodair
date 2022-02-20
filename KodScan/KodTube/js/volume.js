let volumeBlock = document.querySelector(".volume");
let volumeBtn = document.querySelector(".volume-btn");
let volumeSlider = document.querySelector("#volume-slider");

volumeSlider.min = 0;
volumeSlider.max = 100;
volumeSlider.step = 1;

let isMute = localStorage.getItem("isMute");
let cVol = localStorage.getItem("volume");

if (isMute == null) isMute = false;
else if (isMute == "false") isMute = false;
else isMute = true;

if (cVol == null) cVol = 100;

handleVolumeIcon();
if (isMute) mute();
audioPlayer.volume = cVol / 100;
volumeSlider.value = cVol;

volumeSlider.addEventListener("input", () => {
	cVol = volumeSlider.value;
	audioPlayer.volume = cVol / 100;
	// videoPlayer.volume = cVol / 100;
	isChangingVol = true;
	handleVolumeIcon();
	if (isMute) {
		isMute = false;
		mute();
	}
});

volumeSlider.addEventListener("change", () => {
	cVol = volumeSlider.value;
	audioPlayer.volume = cVol / 100;
	// videoPlayer.volume = cVol / 100;
	localStorage.setItem("volume", cVol);
	isChangingVol = false;
});

volumeBlock.addEventListener("mouseenter", function () {
	volumeSlider.classList.remove("hideControl");
});
volumeBlock.addEventListener("mouseleave", function () {
	volumeSlider.classList.add("hideControl");
});

volumeBtn.addEventListener("click", function () {
	isMute = !isMute;
	mute();
});

function volumeDown() {
	volumeSlider.value -= 5;
	cVol = volumeSlider.value;
	audioPlayer.volume = cVol / 100;
	// videoPlayer.volume = cVol / 100;
	localStorage.setItem("volume", cVol);
	handleVolumeIcon();
	if (cVol > 0 && isMute) {
		isMute = false;
		mute();
	}
}
function volumeUp() {
	volumeSlider.value = Number(volumeSlider.value) + 5;
	cVol = volumeSlider.value;
	audioPlayer.volume = cVol / 100;
	// videoPlayer.volume = cVol / 100;
	localStorage.setItem("volume", cVol);
	handleVolumeIcon();
	if (isMute) {
		isMute = false;
		mute();
	}
}

function mute() {
	if (!isMute) {
		handleVolumeIcon();
		audioPlayer.muted = false;
		// videoPlayer.muted = false;
	} else {
		volumeBtn.innerHTML = `<i class="fas fa-volume-mute"> </i>`;
		audioPlayer.muted = true;
		// videoPlayer.muted = true;
	}
	localStorage.setItem("isMute", isMute);
}
function handleVolumeIcon() {
	let cVol = volumeSlider.value;
	if (cVol > 30) {
		volumeBtn.innerHTML = `<i class="fas fa-volume-up"> </i>`;
	} else if (cVol < 30 && cVol > 0) {
		volumeBtn.innerHTML = `<i class="fas fa-volume-down"> </i>`;
	} else if (cVol == 0) {
		volumeBtn.innerHTML = `<i class="fas fa-volume-off"> </i>`;
	}
}
