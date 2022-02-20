// Players
let videoPlayer = document.querySelector("video");
let audioPlayer = document.querySelector("audio");
let ctime = 0;

audioPlayer.loop = false;
videoPlayer.loop = false;
// audio Player listeners
setTimer();
audioPlayer.addEventListener("timeupdate", function () {
	if (!isSeeking) {
		videoSlider.value = audioPlayer.currentTime;
		timeDone = getTime(videoPlayer.currentTime);
		setTimer();
	}
});

function changeAudioPlayerSource(src) {
	audioPlayer.src = src;
}

// Video Player listeners

let videoObj = null;
videoPlayer.setAttribute("preload", "auto");
videoPlayer.addEventListener("mousemove", handleVisibility);

videoPlayer.addEventListener("click", mediaStates);

videoPlayer.addEventListener("loadedmetadata", function () {
	videoPlayer.muted = true;
	videoSlider.min = 0;
	videoSlider.max = videoPlayer.duration;
	audioPlayer.currentTime = ctime;
	videoPlayer.currentTime = ctime;
	videoPlayer.step = audioPlayer.step;
	if (lastCaptionIdx != -1) {
		captions.value = "off";
		// handleCaptions();
	}

	// set duration
	duration = getTime(videoPlayer.duration);
	setTimer();
});

videoPlayer.addEventListener("waiting", function () {
	loader.style.display = "flex";
	videoControls.style.display = "none";
	audioPlayer.pause();
});

videoPlayer.addEventListener("ended", function () {
	audioPlayer.currentTime = 0;
	videoPlayer.currentTime = 0;
	pauseMedia();
});

// videoPlayer.addEventListener("pause", function () {
// 	audioPlayer.pause();
// });

videoPlayer.addEventListener("playing", function () {
	audioPlayer.play();
	videoControls.style.display = "flex";
	loader.style.display = "none";
	handleVisibility();
});

videoPlayer.addEventListener("pause", handlePause);
videoPlayer.addEventListener("play", handlePlay);

videoPlayer.addEventListener("canplay", function () {
	videoControls.style.display = "flex";
	loader.style.display = "none";
});

function handlePlay() {
	isPlaying = true;
	playPauseBtn.innerHTML = `<i class="fas fa-pause">`;
	videoPlayer.currentTime = audioPlayer.currentTime;
}

function handlePause() {
	handleVisibility();
	playPauseBtn.innerHTML = `<i class="fas fa-play">`;
	isPlaying = false;
}

function changeVideoSource(src) {
	ctime = videoPlayer.currentTime;
	// console.log(ctime);
	pauseMedia();
	videoPlayer.src = src;
	playMedia();
	if (!isPlaying) {
		pauseMedia();
	}
}

function setVideoSrc(src) {
	pauseMedia();
	videoPlayer.src = src;
	playMedia();
	if (!isPlaying) {
		pauseMedia();
	}
}

function setAudioSrc(src) {
	pauseMedia();
	audioPlayer.src = src;
	playMedia();
	if (!isPlaying) {
		pauseMedia();
	}
}
