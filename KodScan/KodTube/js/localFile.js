let openFileBtn = document.querySelector(".open-file-btn");

openFileBtn.addEventListener("click", function () {
	let videoFilePath = document.createElement("input");
	videoFilePath.type = "file";
	videoFilePath.accept = "video/*";
	videoFilePath.addEventListener("change", loadLocalVideo);
	videoFilePath.click();
});
