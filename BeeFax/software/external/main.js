////////////////////////////////////////////////////////////////////////////////
// BEEFAX // EXTERNAL: MAIN MENU                                              //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External def: Descriptions
let descriptions = new Array();
descriptions["About"] = "Information about BeeFax.";
descriptions["Heads Up"] = "Today's dashboard: Weather, time, date, and more.";
descriptions["News"] = "Top stories from around the world, brought right to your screen.";
descriptions["Quotes"] = "Inspirational quotes to brighten your day!"
descriptions["Setup"] = "Want something changed? Perform setting change requests here!";
descriptions["[none]"] = "[No Description]";

// Class.
class ExternalMain {

	// Periodic update function.
	static periodicUpdate() {

		// Quit if incorrect menu.
		if (menuName != "main") return;

		// Update values.
		let selection = menuItems[currentItem].getTitle().replace("[ ", "").replace(" ]", "");
		let description = (descriptions[selection]==null ? descriptions["[none]"] : descriptions[selection]);

		// Write to screen.
		BufferInterface.fillText(4, 23, 21, 19, " ");
		let block = new DisplayBlock(formatTextWrap(description, 19), 4, 24);
		block.write();

	}
	
}