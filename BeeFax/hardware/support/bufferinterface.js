////////////////////////////////////////////////////////////////////////////////
// BEEFAX // BUFFER INTERFACE                                                 //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Class.
class BufferInterface {

	// Initialization child function.
	static init() {
		/* Dummy function for now */
	}

	// Buffer resets.
	static reset(buffer, newDefault) {
		for (let row = 0; row < consoleSize.rows; row++) {
			for (let column = 0; column < consoleSize.columns; column++) {
				buffer[row][column] = newDefault;
			}
		}
	}
	static resetAll() {   // Everything.
		this.resetText();
        this.resetFCol();
        this.resetBCol();
        this.resetFBlk();
        this.resetBBlk();
	}
	static resetText() { this.reset(textBuffer, " "); }   // Text.
	static resetFCol() { this.reset(fColBuffer, 0); }     // FCol.
	static resetBCol() { this.reset(bColBuffer, 1); }     // BCol.
	static resetFBlk() { this.reset(fBlkBuffer, false); } // FBlk.
	static resetBBlk() { this.reset(bBlkBuffer, false); } // BBlk.

	// Selection setup.
	static setSelection(enabled, row, column, width = -1, height = -1, lCol = -1, hCol = -1) {
		selection.enabled = enabled;
		selection.row = row;
		selection.column = column;
		if (width >= 0) selection.width = width;
		if (height >= 0) selection.height = height;
	}
	static setSelectionColors(lCol, hCol) {
		selection.lCol = colors[lCol];
		selection.hCol = colors[hCol];
	}
	static showSelection() { selection.enabled = true;  }
	static hideSelection() { selection.enabled = false; }

	// Buffer placers.
	static place(buffer, row, column, newValue) {
		if (row >= 0 && row < consoleSize.rows && column >= 0 && column < consoleSize.columns) {
			buffer[row][column] = newValue;
		}
	}
	static placeText(row, column, newText) { this.place(textBuffer, row, column, newText[0]); }    // Text.
	static placeIcon(row, column, newIcon) { this.place(textBuffer, row, column, ".i:"+newIcon); } // Icon (Text Extension).
	static placeFCol(row, column, newColor) { this.place(fColBuffer, row, column, newColor); }     // FCol.
	static placeBCol(row, column, newColor) { this.place(bColBuffer, row, column, newColor); }     // BCol.
	static placeFBlk(row, column, newState) { this.place(fBlkBuffer, row, column, newState); }     // FBlk.
	static placeBBlk(row, column, newState) { this.place(bBlkBuffer, row, column, newState); }     // BBlk.

	// String writer.
	static writeString(string, row, column, fCol = -1, bCol = -1, fBlk = null, bBlk = null) {
		[...string].forEach((character) => {
			this.placeText(row, column, character);
			if (fCol >= 0) this.placeFCol(row, column, fCol);
			if (bCol >= 0) this.placeBCol(row, column, bCol);
			if (fBlk != null) this.placeFBlk(row, column, fBlk);
			if (bBlk != null) this.placeBBlk(row, column, bBlk);
			column++;
		});
	}

	// Rectangle: Fill.
	static fillRect(row, column, width, height, bCol, bBlk = null) {
		for (let cRow = row; cRow < row+height; cRow++) {
			for (let cColumn = column; cColumn < column+width; cColumn++) {
				this.placeBCol(cRow, cColumn, bCol);
				if (bBlk != null) this.placeBBlk(row, cColumn, bBlk);
			}
		}
	}

	// Rectangle: Text.
	static fillText(row, column, width, height, character, fCol = -1, fBlk = null) {
		for (let cRow = row; cRow < row+height; cRow++) {
			for (let cColumn = column; cColumn < column+width; cColumn++) {
				this.placeText(cRow, cColumn, character);
				if (fCol >= 0) this.placeFCol(cRow, cColumn, fCol);
				if (fBlk != null) this.placeFBlk(cRow, cColumn, fBlk);
			}
		}
	}

}