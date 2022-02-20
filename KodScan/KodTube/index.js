const { app, BrowserWindow } = require("electron");
const { starAPI } = require("./js/startAPI");
function createWindow() {
	const win = new BrowserWindow({
		width: 720,
		height: 1080,
		minWidth: 350,
		webPreferences: { nodeIntegration: true },
	});

	win.loadFile("index.html");
	win.setAspectRatio(16 / 9);
	win.setMenuBarVisibility(false);
}
app.on("ready", createWindow);
app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

// !! function to start API when App launch
// (function () {
// 	try {
// 		starAPI();
// 	} catch (err) {
// 		console.log(err);
// 	}
// })();
