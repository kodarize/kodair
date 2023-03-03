////////////////////////////////////////////////////////////////////////////////
// BEEFAX // MENU OBJECTS                                                     //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Display item object.
class DisplayItem {

	// Constructor.
	constructor(title, row, column, width = -1, offset = -1, fCol = -1, bCol = -1, fBlk = null, bBlk = null) {
		this.title = title;
		this.row = row;
		this.column = column;
		this.width = (title.length>=width ? title.length : (width>=0 ? width : 0));
		this.offset = (offset>=0 ? offset: 0);
		this.fCol = (fCol>=0 ? fCol : 0);
		this.bCol = (bCol>=0 ? bCol : 1);
		this.fBlk = fBlk;
		this.bBlk = bBlk;
	}

	// Type.
	getType() {
		return "item.display";
	}

	// Write function.
	write() {

		// Draw background.
		BufferInterface.fillRect(this.row, this.column, this.width, 1, this.bCol, this.bBlk);

		// Draw foreground.
		BufferInterface.writeString(this.title, this.row, (this.column + this.offset), this.fCol, this.bCol, this.fBlk, this.bBlk);

	}
	
}

// Menu item object.
class MenuItem extends DisplayItem {
	
	// Constructor.
	constructor(title, row, column, callback = null, width = -1, offset = -1, fCol = -1, bCol = -1, fBlk = null, bBlk = null) {
		super(title, row, column, width, offset, fCol, bCol, fBlk, bBlk);
		this.callback = callback;
	}

	// Type.
	getType() {
		return "item.menu";
	}

	// Title.
	getTitle() {
		return this.title;
	}

	// Select function.
	select() {
		BufferInterface.setSelection(true, this.row, this.column, this.width, 1);
		Display.goDraw();
		if (currentUpdateOnNav) currentUpdate();
	}

	// Deselect function.
	deselect() {
		return;
	}

	// Callback runner.
	doCallback() {
		if (this.callback != null) this.callback();
	}

}

// Input item object.
class InputItem extends MenuItem {

	// Constructor.
	constructor(initialValue = null, resetValue = null, callback = null, row, column, width = -1, offset = -1, fCol = -1, bCol = -1, fBlk = null, bBlk = null) {
		if (initialValue == null) initialValue = "";
		if (resetValue == null) resetValue = "";
		super("", row, column, callback, width, offset, fCol, bCol, fBlk, bBlk);
		this.value = initialValue.toString();
		this.resetValue = resetValue.toString();
	}

	// Type.
	getType() {
		return "item.input";
	}

	// Value getter.
	getValue() {
		return this.value;
	}

	// Value setter.
	setValue(newValue) {
		this.value = newValue;
		if (this.callback != null) this.callback(this.value, false);
	}

	// Value resetter.
	doReset() {
		this.value = this.resetValue;
		if (this.callback != null) this.callback(this.value, false);
		this.write(false);
	}

	// Select function.
	select() {
		this.write(true);
		super.select();
	}

	// Deselect function.
	deselect() {
		this.write(false);
	}

	// Update runner.
	doUpdate(keyEvent) {

		// Backspace key, remove last character.
		if (keyEvent.key == "Backspace") {
			if (this.value.length > 0) this.value = this.value.substr(0, this.value.length-1);
		}

		// Other text key, append new character.
		else {
			this.value += keyEvent.key;
		}

		// Write & Perform callback.
		this.write(true);
		if (this.callback != null) this.callback(this.value, true);

	}

	// Write function.
	write(selected = false) {

		// Update title.
		this.title = this.value;

		// Update cursor.
		if (selected) this.title += "▒";

		// Update scrolling.
		if (this.title.length > this.width) {
			this.title = "⏴" + this.value.substring(this.title.length-this.width+1);
		} else {
			BufferInterface.fillText(this.row, this.column+this.title.length, this.width-this.title.length, 1, " ");
		}

		// Perform rest of write.
		super.write();

		// Force screen update.
		Display.goDraw();

	}

}

// Color block object.
class ColorBlock {

	// Constructor.
	constructor(colorData, row, column) {
		this.colorData = colorData;
		this.row = row;
		this.column = column;
	}

	// Type.
	getType() {
		return "block.color";
	}

	// Write function.
	write() {
		for (let cRow = 0; cRow < this.colorData.length; cRow++) {
			for (let cColumn = 0; cColumn < this.colorData[cRow].length; cColumn++) {
				if (this.colorData[cRow][cColumn] != -1) {
					BufferInterface.placeBCol(this.row + cRow, this.column + cColumn, this.colorData[cRow][cColumn]);
				}
			}
		}
	}

}

// Display block object.
class DisplayBlock {

	// Constructor.
	constructor(textData, row, column, fCol = -1, bCol = -1, fBlk = null, bBlk = null) {
		this.textData = textData;
		this.row = row;
		this.column = column;
		this.fCol = fCol;
		this.bCol = bCol;
		this.fBlk = fBlk;
		this.bBlk = bBlk;
	}

	// Type.
	getType() {
		return "block.display";
	}

	// Write function.
	write() {
		for (let tRow = 0; tRow < this.textData.length; tRow++) {
			let item = new DisplayItem(this.textData[tRow], this.row+tRow, this.column, -1, -1, this.fCol, this.bCol, this.fBlk, this.bBlk);
			item.write();
		}
	}

}

// Colortangle object.
class Colortangle {
	
	// Constructor.
	constructor(row, column, width, height, bCol, bBlk = null) {
		this.row = row;
		this.column = column;
		this.width = width;
		this.height = height;
		this.bCol = bCol;
		this.bBlk = bBlk;
	}

	// Type.
	getType() {
		return "colortangle";
	}

	// Write function.
	write() {
		BufferInterface.fillRect(this.row, this.column, this.width, this.height, this.bCol, this.bBlk);
	}

}