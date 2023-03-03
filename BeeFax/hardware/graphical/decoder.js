////////////////////////////////////////////////////////////////////////////////
// BEEFAX // GRAPHICS DECODER                                                 //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External: Decoder information.
const consoleSize = {rows: 24, columns: 45};
const cellSize = {width: (displaySize.width / consoleSize.columns), height: (displaySize.height / consoleSize.rows)};
const defaultDisplayMode = "normal";
var displayMode = defaultDisplayMode;
const defaultErrorMessage = "[ Unknown Error ]";
var errorMessage = defaultErrorMessage;

// External: Colors.
const colors = new Array(
	"white", "black", "red", "green", "gold", "blue", "magenta", "cyan",                     // 00-07: Light colors.
	"lightgray", "gray", "darkred", "darkgreen", "brown", "darkblue", "violet", "steelblue", // 08-15: Dark colors.
	"white", "lightgray", "salmon", "lightgreen", "yellow", "lightblue", "pink", "skyblue",  // 16-23: Highlights.
	"#000000", "#202020", "#404040", "#606060", "#808080", "#A0A0A0", "#C0C0C0", "#F0F0F0"   // 24-31: Grays.
);

// External: Buffers.
var textBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var fColBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var bColBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var fBlkBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var bBlkBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var selection = {enabled: false, row: -1, column: -1, width: 0, height: 0, lCol: colors[12], hCol: colors[2]};

// Class.
class Decoder {

	// Initialization child function.
	static init() {

		// Reset buffers.
		BufferInterface.resetAll();

	}

	// Decoder parent drawing routine.
	static draw(displaySize, canvas, context, bufferNumber) {
		
		// Update according to decoder mode.
		if (displayMode == "blank") this.drawBlank(displaySize, canvas, context, bufferNumber);
		else if (displayMode == "normal") this.drawNormal(displaySize, canvas, context, bufferNumber);
		else this.drawError(displaySize, canvas, context, bufferNumber);

		// Return.
		return;

	}

	// Decoder child drawing routine: Blank.
	static drawBlank(displaySize, canvas, context, bufferNumber) {
		
		// Setup & draw: Black.
		context.fillStyle = "#000000";
		context.fillRect(0, 0, displaySize.width, displaySize.height);

	}

	// Decoder child drawing routine: Normal.
	static drawNormal(displaySize, canvas, context, bufferNumber) {

		// Setup: Text.
		context.font = "16px customFont";
		context.textBaseline = "middle";
		context.textAlign = "center";

		// Draw: Text, FCol, & BCol.
		for (let row = 0; row < consoleSize.rows; row++) {
			for (let column = 0; column < consoleSize.columns; column++) {

				// Draw: BCol.
				if (!(bBlkBuffer[row][column] && bufferNumber==0)) {

					// Set BCol.
					context.fillStyle = colors[bColBuffer[row][column]];

					// Write BCol.
					context.fillRect((column * cellSize.width)-0.5, (row * cellSize.height), cellSize.width+1, cellSize.height);

				}

				// Draw: Text/Icon & FCol.
				if (!(fBlkBuffer[row][column] && bufferNumber==0)) {

					// Set FCol.
					context.fillStyle = colors[fColBuffer[row][column]];

					// Write Text/Icon & FCol.
					let bufData = textBuffer[row][column];
					if ((bufData.length >= 3) && (bufData.substring(0, 3) == ".i:")) {

						// Split package.
						// Format: .i:[IconSet]:[IconCharacter]:[Opt,Size]:[Opt,vOffset]:[Opt,hOffset]
						let pack = bufData.split(":");
						let set = (pack[1] == null ? "" : pack[1]);
						let icon = (pack[2] == null ? "\u0000" : pack[2]);
						let xSize = (pack[3] == null ? "R" : pack[3]);
						let xVOff = (pack[4] == null ? 0 : Number(pack[4]));
						let xHOff = (pack[5] == null ? 0 : Number(pack[5]));

						// Switch to Icon.
						let oldFont = context.font;
						context.font = `${xSize == "XL" ? 24 : xSize == "L" ? 18 : xSize == "R" ? 14 : xSize == "S" ? 10 : xSize == "XS" ? 6 : 14}px customIcon${set}`;

						// Icon & FCol.
						context.fillText(icon, (column * cellSize.width) + (cellSize.width / 2) + xHOff, (row * cellSize.height) + (cellSize.height / 2) + xVOff);

						// Switch back.
						context.font = oldFont;

					} else {

						// Text & FCol.
						context.fillText(bufData, (column * cellSize.width) + (cellSize.width / 2), (row * cellSize.height) + (cellSize.height / 2));

					}

				}

			}
		}

		// Draw: Selection.
		if (selection.enabled) {
			context.strokeStyle = (bufferNumber==0 ? selection.hCol : selection.lCol);
			context.lineWidth = 2;
			context.lineJoin = "bevel";
			context.strokeRect(
				(selection.column * cellSize.width) - 0.5,
				(selection.row * cellSize.height) - 0.5,
				selection.width * cellSize.width,
				selection.height * cellSize.height,
			);
		}

	}

	// Decoder child drawing routine: Error.
	static drawError(displaySize, canvas, context, bufferNumber) {

		// Setup & draw: Background.
		context.fillStyle = "#FF2A2A";
		context.fillRect(0, 0, displaySize.width, displaySize.height);

		// Setup & draw: Title.
		context.fillStyle = "#FF4A4A";
		context.font = "32px customFont"
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillText("An error occurred.", displaySize.width/2, displaySize.height/2);

		// Setup & draw: Subtitle.
		context.fillStyle = "#FF4A4A";
		context.font = "16px customFont"
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillText(errorMessage, displaySize.width/2, (displaySize.height/2)+32);

		// Setup & draw: Reset message.
		context.fillStyle = "#FF4A4A";
		context.font = "16px customFont"
		context.textBaseline = "bottom";
		context.textAlign = "left";
		context.fillText("Press select to reset.", 10, displaySize.height-10);

	}

}