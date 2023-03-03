////////////////////////////////////////////////////////////////////////////////
// BEEFAX // MAIN SCRIPT                                                      //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Class.
class Main {

	// Initialization parent function.
	static initAll() {

		// Initialize BGM.
		Music.init();

		// Perform geolocation.
		ExternalHeadsUp.performGeolocation();

		// Perform after delay.
		setTimeout(() => {
			
			// Initialize autohide.
			AutoHide.init();

			// Initialize decoder.
			Decoder.init();

			// Initialize display.
			Display.init();

			// Initialize interface.
			BufferInterface.init();

			// Initialize menu engine.
			MenuEngine.init();

		}, 250);

	}

	// Unload parent function.
	static doUnload() {

		// Save music data.
		Music.unload();

	}

	// Resize parent function.
	static doResize() {

		// Scale display.
		Display.resize();

	}

	// State parent function.
	static checkState() {

		// Update menu engine.
		MenuEngine.checkState();

	}

	// Keypress parent function.
	static checkKey(e) {

		// Process event.
		e = e || window.event;

		// Process menu engine.
		MenuEngine.checkKey(e);

		// Process news.
		if (menuName == "news") ExternalNews.checkKey(e);

	}

}

// External: (Following) Definitions.
window.onload = Main.initAll;
window.onresize = Main.doResize;
window.onpopstate = Main.checkState;
window.onunload = Main.doUnload;
document.onfullscreenchange = Main.doResize;
document.onkeydown = Main.checkKey;