////////////////////////////////////////////////////////////////////////////////
// BEEFAX // KEYBOARD AUTOFOCUS                                               //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Class.
class AutoFocus {

    // Initialzation child function.
	static init() {
		this.autofocusKeyboard();
	}

    // Original function.
    static autofocusKeyboard() {

        // Set focus on document body.
        document.body.focus();
        document.body.click();

    }

}