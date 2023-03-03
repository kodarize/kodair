////////////////////////////////////////////////////////////////////////////////
// BEEFAX // EXTERNAL: SETUP                                                  //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External def: Last message timeout.
let lmTimeout = null;

// Class.
class ExternalSetup {

	// Status printer.
	static printStatus(newStatus) {

		// Clear last timeout.
		if (lmTimeout) clearTimeout(lmTimeout);

		// Quit if incorrect menu.
		if (menuName != "setup") return;

		// Clear previous.
		BufferInterface.fillText(22, 9, consoleSize.columns, 1, " ", 14);

		// Print new.
		BufferInterface.writeString(newStatus, 22, consoleSize.columns-newStatus.length-1, 14);

		// Set clear timeout.
		lmTimeout = setTimeout(() => { this.clearStatus(); }, 3000);

	}

	// Status clearer.
	static clearStatus() {

		// Quit if incorrect menu.
		if (menuName != "setup") return;

		// Clear previous.
		BufferInterface.fillText(22, 9, consoleSize.columns, 1, " ", 14);

		// Reprint last menu item.
		menuItems[menuItems.length-1].write();
		
	}

	// Track skip.
	static nextTrack() {

		// Play next track.
		Music.nextTrack();

		// Notify user.
		ExternalSetup.printStatus("Playing next track...");

	}

	// Update notifier.
	static notifyUpdate() {

		// Notify user.
		ExternalSetup.printStatus("Setting updated.");

	}

	// Setting resetter.
	static performReset() {

		// Reset all valid objects.
		menuItems.forEach((item) => {
			let type = item.getType();
			if (type == "item.input") {
				item.doReset();
			}
		});

	}

}