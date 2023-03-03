////////////////////////////////////////////////////////////////////////////////
// BEEFAX // EXTERNAL: NETWORK CONNECTION CHECK                               //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Initialization
window.addEventListener("load", (e) => {
	if (navigator.onLine == false) networkErrorTriggered();
});

// Network connection loss.
window.addEventListener("offline", (e) => {
	networkErrorTriggered();
});

// Network error function.
function networkErrorTriggered() {

	// Display error message.
	errorMessage = "Network connection lost.";
	MenuEngine.goMenu("error");
	displayMode = "error";
	bgmPlayer.pause();

}