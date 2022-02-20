let videoControls = document.querySelector(".video-controls");
let playPauseBtn = document.querySelector(".play-pause-btn");
let back10sBtn = document.querySelector(".back-10-sec");
let forward10sBtn = document.querySelector(".forward-10-sec");
let videoSlider = document.querySelector("#video-position");

let loader = document.querySelector(".loader");
let timer = document.querySelector("#timer");

let title = document.querySelector("#title");

let bb = document.querySelector(".bottom-bar");
let tb = document.querySelector(".topBar");

let isChangingVol = false;
let isTyping = false;
let isSettingVisible = false;

let isPlaying = false;
let isSeeking = false;
let duration = "00:00:00";
let timeDone = "00:00:00";

videoSlider.value = 0;
videoSlider.step = 0.1;

let timeout = null;

videoSlider.addEventListener("change", function () {
	pauseMedia();
	videoPlayer.currentTime = videoSlider.value;
	audioPlayer.currentTime = videoSlider.value;
	playMedia();
	isSeeking = false;
});

videoSlider.addEventListener("input", function () {
	isSeeking = true;
});

playPauseBtn.addEventListener("click", mediaStates);

document.addEventListener("keydown", (e) => {
	// shortcuts

	if (e.key == " " && !isTyping) mediaStates();
	// console.log(e);
	if (e.key == "ArrowRight" && !isTyping) {
		seekForward10sVideo();
	}
	if (e.key == "ArrowLeft" && !isTyping) {
		seekBackward10sVideo();
	}
	if (e.key == "ArrowUp" && !isTyping) {
		volumeUp();
	}
	if (e.key == "ArrowDown" && !isTyping) {
		volumeDown();
	}
	if (e.key == "f" && !isTyping) {
		handleFullScreen();
	}
	if (e.key == "m" && !isTyping) {
		isMute = !isMute;
		mute();
	}
	if (e.key == "p" && !isTyping) {
		togglePictureInPicture();
	}

	// console.log(e.key);
});

back10sBtn.addEventListener("click", seekBackward10sVideo);

forward10sBtn.addEventListener("click", seekForward10sVideo);

function seekBackward10sVideo() {
	audioPlayer.currentTime -= 10;
	videoPlayer.currentTime = audioPlayer.currentTime;
}

function seekForward10sVideo() {
	audioPlayer.currentTime += 10;
	videoPlayer.currentTime = audioPlayer.currentTime;
}

function setTimer() {
	timer.textContent = timeDone + " / " + duration;
}

function handleVisibility() {
	clearInterval(timeout);
	videoPlayer.style.cursor = "default";
	tb.classList.remove("hideControl");
	bb.classList.remove("hideControl");
	videoControls.classList.remove("hideControl");
	timeout = setTimeout(function () {
		if (isPlaying && !isChangingVol && !isTyping && !isSettingVisible) {
			videoPlayer.style.cursor = "none";
			tb.classList.add("hideControl");
			bb.classList.add("hideControl");
			videoControls.classList.add("hideControl");
		}
	}, 3000);
}

// media Functions

function mediaStates() {
	if (isPlaying) {
		pauseMedia();
	} else {
		playMedia();
	}
}

function pauseMedia() {
	videoPlayer.pause();
	audioPlayer.pause();
}

function playMedia() {
	videoPlayer.play();
	audioPlayer.play();
	videoPlayer.currentTime = audioPlayer.currentTime;
}
