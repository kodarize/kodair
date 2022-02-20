function getTime(timeInSec) {
	let measureTime = new Date(null);
	measureTime.setSeconds(timeInSec);

	return measureTime.toISOString().substr(11, 8);
}

function isUrl(input) {
	var r = new RegExp(/^(http|https):\/\/[^ "]+$/);

	return r.test(input);
}

function formatFormats() {
	
	if (videoObj == null) return;

	videoObj.validVideoFormat = {};
	videoObj.validAudioFormat = {};
	let videoFormatsList = [];

	for (let x in videoObj.videoFormats) {
		let note = videoObj.videoFormats[x].format_note;
		let url = videoObj.videoFormats[x].url;
		videoObj.validVideoFormat[note] = url;
		videoFormatsList.push(note);
	}
	for (let x in videoObj.audioFormats) {
		let url = videoObj.audioFormats[x].url;
		videoObj.validAudioFormat[videoObj.audioFormats[x].format_id] = url;
	}
	videoObj.availableFormats = videoFormatsList;
	setAvailableFormats();
}

function setVideoAndAudio() {
	isLive = false;
	videoPlayer.poster = videoObj.thumbnail;
	title.textContent = videoObj.title;

	if (videoObj.availableFormats.length == 0) {
		videoPlayer.setAttribute("type", "application/x-mpegURL"); // for live stream videos

		setVideoSrc(videoObj.url);
		videoPlayer.muted = false;
	} else {
		videoPlayer.setAttribute("type", "video/webm"); // for normal Videos

		setAudioSrc(videoObj.validAudioFormat["251"]);
		if (!videoObj.availableFormats.includes("360p")) {
			setVideoSrc(videoObj.validVideoFormat[videoObj.availableFormats[0]]);
			setCurrFormatVal(videoObj.availableFormats[0]);
		}

		setVideoSrc(videoObj.validVideoFormat["360p"]);
		setCurrFormatVal("360p");
	}
	addCaptionsToSelector();
}
