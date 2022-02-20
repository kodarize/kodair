let fullscreen = document.querySelector(".fullscreen");
let pip = document.querySelector(".pip");

let isFullScreen = false;
let isPip = false;

let container = document.documentElement;
fullscreen.addEventListener("click", handleFullScreen);
pip.addEventListener("click", togglePictureInPicture);

function togglePictureInPicture() {
	if (document.pictureInPictureElement) {
		document.exitPictureInPicture();
	} else {
		if (document.pictureInPictureEnabled) {
			videoPlayer.requestPictureInPicture();
		}
	}
}

function handleFullScreen() {
	if (isFullScreen) {
		fullscreen.innerHTML = `<i class="fas fa-expand"></i>`;
		closeFullscreen();
	} else {
		fullscreen.innerHTML = `<i class="fas fa-compress-arrows-alt"></i>`;
		openFullscreen();
	}
	isFullScreen = !isFullScreen;
}

function openFullscreen() {
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.webkitRequestFullscreen) {
		/* Safari */
		container.webkitRequestFullscreen();
	} else if (container.msRequestFullscreen) {
		/* IE11 */
		container.msRequestFullscreen();
	}
}

/* Close fullscreen */
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		/* Safari */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		/* IE11 */
		document.msExitFullscreen();
	}
}
