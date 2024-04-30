var playing = false;

let globalVolume = 0.5;

var textures = [];
var numtextures = 9;
const volumeMap = {0:1, 1:0.3, 2:0.8, 3:0.35, 4:0.2, 5:0.2, 6:0.15, 7:0.1, 8:0.3};

var notes = [];
var numnotes = 21;

// backplate: a constant sound to underscore all the textures and notes
var backplate = document.createElement("AUDIO");
backplate.src = "spooky_audio/backplate.mp3";
backplate.volume = 0.7;
var backplate_snd = document.createElement("AUDIO");
backplate_snd.src = "spooky_audio/backplate.mp3";
backplate_snd.volume = 0.7;
var backplate_secondary = true;
var backplate_secondary_delay_timeout = null;
var backplate_interval = null;
var backplate_interval_snd = null;

// volume slider stuff
let volumeSlider = document.getElementById('volumeSlider');
volumeSlider.oninput = () => {
	globalVolume = volumeSlider.value / volumeSlider.max;

	// change volume of everything
	for(let i = 0; i < textures.length; i++){ // textures
		try{
			textures[i].volume = globalVolume;
		}
		catch(e){}
	}
	for(let i = 0; i < notes.length; i++){ // notes
		try{
			notes[i].volume = globalVolume;
		}
		catch(e){}
	}
	backplate.volume = globalVolume;
	backplate_snd.volume = globalVolume;
}

// help button stuff
var helpButton = document.getElementById("helpbutton");

positionInfoButton();

function positionInfoButton(){
    helpButton.style.top = (window.innerHeight - 48 - 15) + "px";
    helpbutton.style.left = (window.innerWidth / 2 - 50) + "px";
}

// initialize textures and notes as lists of nulls
for (var i = 0; i < numtextures; i++){
	textures.push(null);
}
for (var i = 0; i < numnotes; i++){
	notes.push(null);
}

console.log("...");

function stop_spook(){
	playing = false;
	for (var i = 0; i < numtextures; i++){
		if(textures[i] != null){
			textures[i].pause();
		}
	}
	for (var i = 0; i < numnotes; i++){
		if(notes[i] != null){
			notes[i].pause();
		}
	}
	clearInterval(backplate_interval);
	clearInterval(backplate_interval_snd);
	backplate.pause();
	backplate_snd.pause();
	clearTimeout(backplate_secondary_delay_timeout);
}

function spook(){
	playing = true;
	play_backplate_dir();
	setTimeout(play_textures, 15000);
	setTimeout(play_notes, 10000);
}

function play_backplate_dir(){
	if (playing){
		backplate.play();
		backplate_secondary_delay_timeout = setTimeout(loop_backplate_snd, 50000);
		backplate_interval = setInterval(play_backplate, 100000);
	}
}

function loop_backplate_snd(){
	if (playing){
		backplate_snd.play();
		backplate_interval_snd = setInterval(play_backplate_snd, 100000);
	}
}	

function play_backplate(){
	if (playing) backplate.play();
}

function play_backplate_snd(){
	if (playing) backplate_snd.play();
}

function play_textures(){
	if (playing){
		console.log("playing a texture...");
		var tmpidx = Math.floor(Math.random() * numtextures);
		if (textures[tmpidx] == null){
			textures[tmpidx] = document.createElement("AUDIO");
			textures[tmpidx].src = "spooky_audio/textures/texture_" + tmpidx + ".mp3";
		}
		while (textures[tmpidx].ended = false){
			tmpidx = Math.floor(Math.random() * numtextures);
		}
		textures[tmpidx].volume = volumeMap[tmpidx];
		textures[tmpidx].play();
		var min = 10000
		var range = 10000
		setTimeout(play_textures, Math.floor(Math.random() * range) + min);
	}
}

function play_notes(){
	if (playing){
		console.log("playing a note...");
		var tmpidx = Math.floor(Math.random() * numnotes);
		if (notes[tmpidx] == null){
			notes[tmpidx] = document.createElement("AUDIO");
			notes[tmpidx].src = "spooky_audio/notes/note_" + tmpidx + ".mp3";
		}
		notes[tmpidx].volume = (Math.random() * 0.5) + 0.25
		notes[tmpidx].play();
		setTimeout(play_notes, Math.floor(randn_bm(500, 20000, 3)));
	}
}

function randn_bm(min, max, skew) {
	// copied from https://stackoverflow.com/a/49434653/13010844

	let u = 0, v = 0;
	while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while(v === 0) v = Math.random();
	let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

	num = num / 10.0 + 0.5; // Translate to 0 -> 1
	if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
	num = Math.pow(num, skew); // Skew
	num *= max - min; // Stretch to fill range
	num += min; // offset to min
	return num;
}

function showInfo(){
    var str = "This spooky music generator uses a single baseplate texture which you hear at the start and throughout, and 9 other texture sounds that weave in and out. It also uses 21 different piano notes, sampled from a patch I designed in FL Studio.";
    Swal.fire({
		title: "How it Spooks",
		text: str,
		icon: "info"
	});
}