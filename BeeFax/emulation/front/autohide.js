////////////////////////////////////////////////////////////////////////////////
// BEEFAX // CURSOR AUTOHIDE                                                  //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Class.
class AutoHide {

	// Initialzation child function.
	static init() {
		this.autohideCursor();
		document.documentElement.style.cursor = 'none';
	}

	// Original function.
	// Source: https://github.com/defaude/autohide-cursor/blob/master/autohide-cursor.js
	// Modified so it can be used outside of a normal module pov.
	static autohideCursor(delay = 1e3) {

		function showCursor() {
			document.documentElement.removeAttribute('style');
		}

		function hideCursor() {
			document.documentElement.style.cursor = 'none';
		}

		let timeout;

		document.documentElement.addEventListener('mousemove', function () {
			showCursor();
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(hideCursor, delay);
		}, false);

		setTimeout(hideCursor, delay);

	}

}