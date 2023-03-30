let textSpeed = 20; //ms
let videoText = "VIDEO FEED:" + '\n' + " ~~ " + '\n' + '\n' + " ~~ ";
let audioText = "AUDIO FEED:";
let logText = "This is a log of your inputs";
let logHistory = [];
let gameSpeed = 20;
let videoDiv = document.getElementById('video');
let audioDiv = document.getElementById('audio');
let logDiv = document.getElementById('log');
let input = 'default';
let logSize = 6;
let typingStyle = "text";
let typingColor = 'ffffff';
let hour = 0;
let minute = 0;
let second = 0;
let millisecond = 0;
let areaNum = 0;
let locations = [];
class Location {
    constructor(desc, objects, entities, locations) {
        this.description = desc;
        this.objects = objects;
        this.entities = entities;

    }
}
locations.push(new Location("The screen is dark.", null, null, null));
let currentLocation = locations[0];

document.addEventListener('keydown', function(event) {
    if(event.keyCode === 13) {
        console.log("enter pressed");

        takeInput();
    }
});

let audioTextActual = [];
let audioTextQueue = "AUDIO LOG:";
let readyForInput = true;
let getName = true;
let name = "default";
let getTutorial = true;
let getTutorial2 = false;

function takeInput() {
    if (!readyForInput) {
        return;
    }
    input = document.getElementById('input').value;
    document.getElementById('input').value = '';
    logHistory.push(input); //ADD INPUT TO LOG HISTORY

    //TURN LOG HISTORY INTO TEXT
    let text = '';
    for (let i = 0; i < logHistory.length; i++) {
        text = text.concat('CONSOLE INPUT: ' + logHistory[i] + '\n');
    }
    while (logHistory.length >= logSize) {
        logHistory.splice(0, 1);
    }
    logText = text;
    console.log('new input: ' + input);

    processInput();

} //change inputvalue to input
function checkReady() {
    readyForInput = true;
    if (audioTextQueue.length <= 0) {
    } else {
        readyForInput = false;
    }

    if (readyForInput) {
        document.getElementById('input').style.border = '5px solid darkgreen';
    } else {
        document.getElementById('input').style.border = '5px solid darkred';
    }
} //check for advancing audio text, or other game haulting exposition
function time() {
    let hourText = hour;
    if (hour < 10) {
        hourText = "0" + hour;
    }
    let minuteText = minute ;
    if (minute < 10) {
        minuteText = "0" + minute;
    }
    let secondText = second;
    if (second < 10) {
        secondText = "0" + second;
    }
    return " (" + hourText + ":" + minuteText + ":" + secondText + ") ";
}
function advanceTime(extra) {
    millisecond += gameSpeed;
    if (extra != null) millisecond += extra
    while (millisecond > 1000) {
        millisecond -= 1000;
        second++;
    }
    while (second > 60) {
        second -= 60;
        minute++;
    }
    while (minute > 60) {
        minute -= 60;
        hour++;
    }
    while (hour > 24) {
        hour -= 24;
    }
}
function addAudio(audio) {
    audioTextQueue = audioTextQueue.concat(audio);
}

//% = skip, & == bold, $ == italic, @ == strike, * == normal, # == read hexadecimal color, ^ == reset color
function advanceAudio() {
    if (audioTextQueue.length > 0) {
        let newChar = audioTextQueue[0];
        if (newChar === '&') {
            typingStyle = "b";
            audioTextQueue = audioTextQueue.slice(1);
        } else if (newChar === '$') {
            typingStyle = "i";
            audioTextQueue = audioTextQueue.slice(1);
        } else if (newChar === '#') {
            typingColor = audioTextQueue.substring(1, 7);
            console.log(typingColor);
            audioTextQueue = audioTextQueue.substring(7, audioTextQueue.length);
        } else if (newChar === '^') {
            let character = audioTextQueue.substring(1, 2);
            switch (character) {
                case ('1'):
                    typingColor = "ffffff"
                    break;
                case ('2'):
                    typingColor = "ff0000"
                    break;
                case ('3'):
                    typingColor = "0000ff"
                    break;
                case ('4'):
                    typingColor = "ff00ff"
                    break;
                default:
                    typingColor = "ffffff"
                    break;
            }
            audioTextQueue = audioTextQueue.substring(2, audioTextQueue.length);
        }  else if (newChar === '@') {
            typingStyle = "s";
            audioTextQueue = audioTextQueue.slice(1);
        } else if (newChar === '*') {
            typingStyle = "text";
            typingColor = "ffffff";
            audioTextQueue = audioTextQueue.slice(1);
        }
        else {
            if (newChar === '%') {
            let newWord = "";
            newChar = audioTextQueue[1];
            let index = 1;
            while (newChar !== "%") {
                index++;
                newWord = newWord.concat(newChar);
                newChar = audioTextQueue[index];
            }
            audioTextQueue = audioTextQueue.substring(index + 1, audioTextQueue.length);
            //audioTextActual = audioTextActual.concat(newWord);
            let child = document.createElement(typingStyle);
            child.innerText = newWord;
            child.style.color = '#' + typingColor;
            audioTextActual.push(child);
        } //skip text inbetween %
            else {
            audioTextQueue = audioTextQueue.slice(1);
            let child = document.createElement(typingStyle);
            child.style.color = '#' + typingColor;
            child.innerText = newChar;
            audioTextActual.push(child);
            //audioTextActual = audioTextActual.concat(newChar);
        } //add new elements
        }
    }
    audioText = audioTextActual;

} //convert audioqueue to audiotext

function progressGame() {
    advanceTime();

    advanceAudio();

    checkReady()

    setText();

} //game step
function processInput() {
    if (getName) {
        name = input;
        name = name.toLocaleUpperCase();
        addAudio('\n' + '*' + time() + '^3' + name + '^1: \"' + input + "*\"")
        addAudio("\n" + '*' + time() + "^2COMMAND^1: \"Thank you, " + name + "\"");
        addAudio("\n" + '*' + time() + "^2COMMAND^1: \"" + name + ", would you like instructions on equipment operation?\" (YES/NO)");
        getName = false;
        return;
    }
    if (getTutorial) {
        if (input.substring(0,1).toLocaleLowerCase() == "y") {
            addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + "Yes." + "*\"")
            addAudio("\n" + '*' + time() + "^2COMMAND^1: \"Simply speak commands into the microphone box to your operational team or computer. Improper commands will be ignored. Any videos or microphones will display information on the screen for you.\"");
            getTutorial = false;
            getTutorial2 = true;
            addAudio("\n" + '*' + time() + "^2COMMAND^1: \"Try these commands to the computer... \'help\', \'team\', \'logs\'. When you are ready, say \'ready\'.");
        } else
        if (input.substring(0,1).toLocaleLowerCase() == "n") {
            addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + "No." + "*\"")
            addAudio("\n" + '*' + time() + "^2COMMAND^1: \"Of course, given your experience...\"");
            addAudio("\n" + '*' + time() + "^2COMMAND^1: \"It is time to begin Experiment 2. I assume you already read Experiment Log 1, to understand why you are now in charge, and the risks of this assignment? (You can find all logs in the computer by saying \'logs\')\"");
            getTutorial = false;
        }
        return;
    }
    if (getTutorial2) {
        if (input.toLocaleLowerCase() === "logs") {
            addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + input + "*\"")
            addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"$Available Logs: 1.\"");
            addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"$Request Specific Log Using: \n--\'play log1\'\"");
            return;
        }
        if (input.toLocaleLowerCase() === "play log1") {
            playLog1();
            return;
        }
        if (input.toLocaleLowerCase() === "help") {
            addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + input + "*\"")
            addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"$Get Fucked Idiot!\"");
            return;
        }
        if (input.toLocaleLowerCase() === "team") {
            addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + input + "*\"")
            addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"$You are the operational researcher. Above is you is Site Command, and below you are D-Class personel, and assigned MTF operatives.\"");
            return;
        }
        if (input.toLocaleLowerCase() == "ready") {
            addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + input + "*\"")
            addAudio("\n" + '*' + time() + "^2COMMAND^1: \"It is time to begin Experiment 2. I assume you already read Experiment Log 1, to understand why you are now in charge, and the risks of this assignment? (You can find all logs in the computer by saying \'logs\')\"");
            getTutorial2 = false;
        }
        return;
    }
    if (input === "") {
        addAudio('\n' + '*%' + time() + name + ':%' + '$ intense silence*');
        return;
    }
    if (input.toLocaleLowerCase() === "logs") {
        addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + input + "*\"")
        addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"$Available Logs: 1.\"");
        addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"$Request Specific Log Using: \n--\'play log1\'\"");
        return;
    }
    if (input.toLocaleLowerCase() === "play log1") {
        playLog1();
        return;
    }
    if (input.toLocaleLowerCase() === "help") {
        addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + input + "*\"")
        addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"$Get Fucked Idiot!\"");
        return;
    }
    if (input.toLocaleLowerCase() === "team") {
        addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + input + "*\"")
        addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"$You are the operational researcher. Above is you is Site Command, and below you are D-Class personel, and assigned MTF operatives.\"");
        return;
    }
    addAudio('\n' + '*%' + time() + '%^3' + name + '^1: \"' + input + "*\"")
} //change input to game actions
function playLog1() {
    addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"Clearance Credentials Accepted.\"");
    addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"Accessing Log1, recorded 12/11/2021.\"");
    addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"Playing Log1.\"");
    addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"(COMMAND): Begin the experiment.\"");
    addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"(KOI): This is Doctor Koi, beginning Experiment 1 on SCP-093.\"");
    addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"(D-CLASS): I am here \"");
    addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"(COMPUTER): COmpooter noises \"");
    addAudio("\n" + '*' + time() + "^4COMPUTER^1: \"End Log. \"");
}
function setText() {
    audioDiv.innerHTML = "";
    let startChild = document.createElement("text");
    startChild.innerText = "AUDIO LOG: ";
    for (let i = 0; i < audioTextActual.length; i++) {
        audioDiv.appendChild(audioTextActual[i]);
    }
    logDiv.innerText = logText;

    videoText = currentLocation.description;
    document.getElementById("videotext").innerText = videoText;

    document.getElementById("audio").scrollTop = document.getElementById("audio").scrollHeight
    document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight
    document.getElementById("video").scrollTop = document.getElementById("video").scrollHeight

} //set text of html elements

function startGame() {
    addAudio("\n$Initializing audio capture system...");
    addAudio("\nBooting ^4MultiCmmctr^1V3.0...");
    addAudio("\nStarting VideoUplink...*");
    addAudio("\n" + '*' + time() + "^2COMMAND^1: \"Please speak your name into the microphone...\"");
    setInterval(() => {
        requestAnimationFrame(progressGame);
    }, gameSpeed);
} //start new game
startGame();

//WHAT HAVE I DONE:
//Audio is added via addAudio, it takes a string and turns into into an array of single digit
//text elements. Certain symbols are ignored, and # accepts the next 6 symbols as hexadecimal.

//TO DO: improve color codability in audio
//random text symbols in audio and video
//stylize video
//vitals, team, computer, commands, tutorial, logs, team command
