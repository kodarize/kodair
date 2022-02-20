let menu = document.querySelector(".menu");
let openFile = document.querySelector(".open-file");
let addSub = document.querySelector(".add-sub");

let menuVisible = false;

const toggleMenu = (command) => {
	menu.style.display = command === "show" ? "flex" : "none";
	menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
	menu.style.left = `${left}px`;
	menu.style.top = `${top}px`;
	toggleMenu("show");
};

window.addEventListener("click", () => {
	if (menuVisible) toggleMenu("hide");
});

window.addEventListener("contextmenu", (e) => {
	e.preventDefault();
	const origin = {
		left: e.pageX,
		top: e.pageY,
	};
	setPosition(origin);
	return false;
});

openFile.addEventListener("click", function () {
	let videoFilePath = document.createElement("input");
	videoFilePath.type = "file";
	videoFilePath.accept = "video/*";
	videoFilePath.addEventListener("change", loadLocalVideo);
	videoFilePath.click();
});

function loadLocalVideo(e) {
	let file = e.path[0].files[0];
	let url = window.URL.createObjectURL(file);
	// console.log(file);
	videoObj = null;
	videoPlayer.innerHTML = "";
	formats.innerHTML = `<option value="NA">NA</option>`;
	captions.innerHTML = `<option value="NA">NA</option>`;
	ctime = 0;
	setVideoSrc(url);
	setAudioSrc(url);
	title.textContent = file.name;
}
