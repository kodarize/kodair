const msgcanvas = document.getElementById('PichmCanvas');
const msgctx = msgcanvas.getContext('2d');

// Render functions

msgctx.imageSmoothingEnabled = true
var Nds = new FontFace('Nds', 'url(https://pipe.miroware.io/5f586dbe02740c4a7fb69f99/Personal%20Sites/Fonts/NDS12.ttf)');

let colora = "#FFF700"
let colorb = "#FFB500"
let name = "PictoChum"

let ratiox = 232;
let ratioy = 83;
let scale = 2

let init = () => {
	msgcanvas.width = ratiox * scale;
	msgcanvas.height = ratioy * scale;
	
	msgctx.fillStyle = '#FFF700';
	msgctx.fillRect(0, 0, msgcanvas.width, msgcanvas.height);
	msgctx.fillStyle = 'white';
	msgctx.fillRect(2, 2, msgcanvas.width - 4, msgcanvas.height - 4);
	
	drawHeader(msgctx)
}
let drawHeader = (ctx) => {
	ctx.fillStyle = colora
	ctx.fillRect(0, 0, 57 * scale, 16 * scale);
	ctx.fillRect(0, 0, 56 * scale, 17 * scale);
	ctx.fillRect(0, 0, 58 * scale, 15 * scale);
	ctx.fillStyle = colorb
	ctx.fillRect(0, 0, 56 * scale, 16 * scale);
	ctx.fillRect(0, 0, 57 * scale, 15 * scale);
	
	ctx.fillStyle = "black"
	ctx.font = "20px Nds"
	ctx.textBaseline = "bottom";
	ctx.fillText(name, 3 * scale, 14 * scale)
}

Nds.load().then(function(font){
  document.fonts.add(font);
  console.log('Font loaded');
	
	init()
})

// Drawing functions

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;
let drawscale = scale/2

var prevxpos = 0
var prevypos = 0

let start = event => {
	is_drawing = true;
	event.preventDefault();
	
	prevxpos = getCoordX(event)
	prevypos = getCoordY(event)
}

let draw = event => {
	if(is_drawing) {
		var xpos = getCoordX(event)
		var ypos = getCoordY(event)
		msgctx.fillStyle = draw_color
		//find multiple points on line and fill
		var ratio = 0.01;
		var deltax = xpos - prevxpos
		var deltay = ypos - prevypos
		var distance = Math.sqrt(deltax * deltax + deltay * deltay)
		for (let i = 0; i < distance; i++) {
			var stepx = xpos - deltax * (i / distance)
			var stepy = ypos - deltay * (i / distance)
			msgctx.fillRect(floorToScale(stepx, scale), 
											floorToScale(stepy, scale),
											draw_width * scale, draw_width * scale);
		}
		
		msgctx.fillRect(floorToScale(xpos, scale), 
										floorToScale(ypos, scale),
										draw_width * scale, draw_width * scale);
		
		prevxpos = xpos
		prevypos = ypos
		
		drawHeader(msgctx)
	}
	event.preventDefault();
}

let stop = event => {
	if (is_drawing) {
		is_drawing = false
		
		drawHeader(msgctx)
	}
	event.preventDefault();
}

let getCoordX = event => (event.clientX - getCoords(msgcanvas).left )*drawscale
let getCoordY = event => (event.clientY - getCoords(msgcanvas).top )*drawscale

function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

msgcanvas.addEventListener("touchstart", start, false);
msgcanvas.addEventListener("touchmove", draw, false);
msgcanvas.addEventListener("mousedown", start, false);
msgcanvas.addEventListener("mousemove", draw, false);

msgcanvas.addEventListener("touchend", stop, false);
msgcanvas.addEventListener("mouseup", stop, false);
msgcanvas.addEventListener("mouseout", stop, false);

// Pixelise
let floorToScale = (pos, scale) => Math.floor(pos/scale) * scale;

//Button functions

let Pencil = () => {	draw_color = "black";	}
let Eraser = () => {	draw_color = "white";	}
let Thick = () => {	draw_width = "2";	}
let Thin = () => {	draw_width = "1";	}

//Draw text

let spacer = "                    "

let preserverSpace = () => {
	const PichmText = document.getElementById('PichmText');
	if (PichmText.value.substring(0,20) !== spacer) {
		PichmText.value = spacer + PichmText.value.substring(20)
	}
}

let drawText = () => {
	const PichmText = document.getElementById('PichmText');
	wrapText(msgctx, PichmText.value, 1.5 * scale, 14 * scale, msgcanvas.width, msgcanvas.height/5);
	drawHeader(msgctx);
	PichmText.value = spacer;
}

// http: //www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var cars = text.split("\n");

	for (var ii = 0; ii < cars.length; ii++) {

		var line = "";
		var words = cars[ii].split(" ");

		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + " ";
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;

			if (testWidth > maxWidth) {
				context.fillText(line, x, y);
				line = words[n] + " ";
				y += lineHeight;
			}
			else {
				line = testLine;
			}
		}

		context.fillText(line, x, y);
		y += lineHeight;
	}
}

//Save image

function saveImage(){
	var imagePath = msgcanvas.toDataURL()
	var imageName = "PictoChumImage"
	
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link)
  link.setAttribute('download', imageName + '.png');
  link.setAttribute('href', imagePath.replace("image/png", "image/octet-stream"));
  link.click();
}