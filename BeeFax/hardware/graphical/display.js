////////////////////////////////////////////////////////////////////////////////
// BEEFAX // DISPLAY MANAGER                                                  //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External: Canvas & display information.
var canvases = new Array();
canvases[0] = document.getElementById("display-1");
canvases[1] = document.getElementById("display-2");
const displaySize = {width: 704, height: 576};

// External: Buffer selection.
var drawingBuffer = 0;
var displayBuffer = 1;

// External: Refresh data.
var refreshRoutine = null;

// Class.
class Display {

	// Initialization child function.
	static init() {

		// Size canvases.
		canvases.forEach((canvas) => {
			canvas.width = displaySize.width;
			canvas.height = displaySize.height;
		});

		// Scale canvases.
		this.resize();

		// Disable smoothing.
		// Value names found here: https://www.html5gamedevs.com/topic/1342-nearest-neighbour-resizing-for-pixelart/?do=findComment&comment=8889
		canvases.forEach((canvas) => {
			let context = canvas.getContext("2d");
			context["imageSmoothingEnabled"] = false;
			context["oImageSmoothingEnabled"] = false;
			context["webkitImageSmoothingEnabled"] = false;
			context["msImageSmoothingEnabled"] = false;
		});

		// Start refresh routine.
		refreshRoutine = setInterval(this.refresh, 250);

	}

	// Resize child function: Display.
	// Scaling idea from: https://gist.github.com/zachstronaut/1184900
	static resize() {

		// Calculate scaling.
		let scale = {x: 1, y: 1};
		scale.x = (window.innerWidth) / displaySize.width;
		scale.y = (window.innerHeight) / displaySize.height;
		scale = scale.x + ', ' + scale.y;

		// Scale canvases.
		canvases.forEach((canvas) => {
			canvas.setAttribute('style', `-ms-transform-origin: left top; -webkit-transform-origin: left top; -moz-transform-origin: left top; -o-transform-origin: left top; transform-origin: left top; -ms-transform: scale(${scale}); -webkit-transform: scale3d(${scale}, 1); -moz-transform: scale(${scale}); -o-transform: scale(${scale}); transform: scale(${scale});`);
		});

	}

	// Display drawer.
	static goDraw() {

		// Perform draw.
		const canvas = canvases[drawingBuffer];
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		Decoder.draw(displaySize, canvas, context, drawingBuffer);

	}

	// Display refresh routine.
	// Double-buffer method from: https://stackoverflow.com/a/2864533/11018374
	static refresh() {

		// Swap buffers.
		let temp = drawingBuffer;
		drawingBuffer = displayBuffer;
		displayBuffer = temp;

		// Update visibility.
		canvases[displayBuffer].classList.toggle("show");
		canvases[drawingBuffer].classList.toggle("show");

		// Obtain & draw display.
		Display.goDraw();

	}

}