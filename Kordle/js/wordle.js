dictionary = [];

keyboardKeys = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];
guessedKeys = [];

wordLength = 5;
numGuesses = 6;
word = null;
guesses = null;
currentGuess = 0;

finished = false;
win = false;

wordleGuessesDiv = null;
wordleKeyboardDiv = null;
wordleAlertDiv = null;
shareAreaButton = null;
shareAreaAlertDiv = null;

function initialise() {
    initialiseGuesses();
    pickWord();
    captureDivs();
    prepareGuessBoard();
    prepareKeyboard();
}

function initialiseGuesses() {
    guesses = []
    for (var g = 0; g < numGuesses; g++) {
        guess = []
        for (var c = 0; c < wordLength; c++) {
            guess.push(['',0]);
        }
        guesses.push(guess);
    }
}

function pickWord() {
    dictionary = getWords();
    word = pickRandomWordFromDict();
}

function pickRandomWordFromDict() {
    return dictionary[Math.floor(Math.random() * dictionary.length)];
}

function captureDivs() {
    wordleGuessesDiv = document.getElementsByClassName("wordleGuesses")[0];
    wordleKeyboardDiv = document.getElementsByClassName("wordleKeyboard")[0];
    wordleAlertDiv = document.getElementsByClassName("wordleAlerts")[0];
    shareAreaAlertDiv = document.getElementsByClassName("shareAreaAlert")[0];
    shareAreaButton = document.getElementsByClassName("shareAreaButton")[0];
}

function prepareGuessBoard() {
    var wordleGuessDivText = "";
    for (var g = 0; g < numGuesses; g++) {
        wordleGuessDivText += "<div class='wordleGuessRow'>";
        for (var c = 0; c < wordLength; c++) {
            var guess = guesses[g][c];
            var guessedChar = guess[0];
            var score = guess[1];

            var wordleTile = `
                <div class="wordleGuessTile score-${score}">
                    ${guessedChar}
                </div>
            `;
            wordleGuessDivText += wordleTile;
        }
        wordleGuessDivText += "</div>";
    }
    wordleGuessDivText += "</div>"
    wordleGuessesDiv.innerHTML = wordleGuessDivText;
}

function prepareKeyboard() {
    var wordleKeyboardDivText = "";
    for (var irow = 0; irow < keyboardKeys.length; irow++) {
        for (var ikey = 0; ikey < keyboardKeys[irow].length; ikey++) {
            var key = keyboardKeys[irow][ikey];
            var keyDiv = `<input id="key-${key}" type="button"
                            class="wordleKeyboardKey" 
                            onclick="keyPress('${key}')" 
                            value="${key}" ${finished?'disabled':''}/>`;
            wordleKeyboardDivText += keyDiv;    
        }
        wordleKeyboardDivText += "</br>"
    }

    wordleKeyboardDivText += `
        <input id="key-enter" type="button" class="wordleKeyboardKey"
            onclick="enterPress()" value="Enter" ${finished?'disabled':''} />
    `;
    wordleKeyboardDivText += `
        <input id="key-backspace" type="button" class="wordleKeyboardKey"
            onclick="backspacePress()" value="&#8592;" ${finished?'disabled':''} />
    `;

    wordleKeyboardDiv.innerHTML = wordleKeyboardDivText;
}

function calculateCharacterCounts() {
    var charCounts = {};
    for (var ichar = 0; ichar < word.length; ichar++) {
        if (!charCounts.hasOwnProperty(word[ichar])) {
            charCounts[word[ichar]] = 1;
        } else {
            charCounts[word[ichar]] += 1;
        }
    }
    return charCounts;
}

guessedWord = "";
function keyPress(keyValue) {
    if (guessedWord.length < wordLength) {
        guessedWord += keyValue;
    }

    guesses[currentGuess][guessedWord.length-1] = [keyValue, 0]
    prepareGuessBoard()
}

function backspacePress() {
    guessedWord = guessedWord.slice(0, -1);
    guesses[currentGuess][guessedWord.length] = ['', 0]
    wordleAlertDiv.innerHTML = "";
    prepareGuessBoard()
}

function enterPress() {
    if (guessedWord.length == wordLength && !finished && dictionary.includes(guessedWord)) {
        var charCounts = calculateCharacterCounts();

        // Check for matches
        for (var ichar = 0; ichar < wordLength; ichar++) {
            var match = guessedWord[ichar] == word[ichar];
            if (match) {
                charCounts[guessedWord[ichar]]--;
                guesses[currentGuess][ichar] = [guessedWord[ichar], 3];
            }
        }

        // Check for partial matches
        for (var ichar = 0; ichar < wordLength; ichar++) {
            if (guesses[currentGuess][ichar][1] == 0) {
                var hasChar = charCounts.hasOwnProperty(guessedWord[ichar]);
                var partialMatch = hasChar && charCounts[guessedWord[ichar]] > 0;

                var score = 1;
                if (partialMatch) {
                    score = 2;
                }

                charCounts[guessedWord[ichar]]--;
                guesses[currentGuess][ichar] = [guessedWord[ichar], score];
            }
        }

        currentGuess++;

        prepareGuessBoard();
        if (isWin()) {
            wordleAlertDiv.innerHTML = "CONGRATS: " + word;
            shareAreaButton.removeAttribute('disabled');
            finished = true;
            win = true;
        } else if (isLoss()) {
            wordleAlertDiv.innerHTML = "HARD LUCK, MATE: " + word;
            shareAreaButton.removeAttribute('disabled');
            finished = true;
        }
        prepareKeyboard();

        guessedWord = "";
    } else if (!dictionary.includes(guessedWord) && !finished) {
        wordleAlertDiv.innerHTML = "Not recognised";
    }
}

function isWin() {
    return guessedWord == word;
}

function isLoss() {
    return currentGuess >= numGuesses;
}

greenSquare = "0x1f7e9";
orangeSquare = "0x1f7e7";
greySquare = "0x2b1b";

function getShareLink() {
    var emojiOutput = '';
    for (var r = 0; r < guesses.length; r++) {
        for (var c = 0; c < guesses[r].length; c++) {
            switch(guesses[r][c][1]) {
                case 1: emojiOutput += String.fromCodePoint(greySquare); break;
                case 2: emojiOutput += String.fromCodePoint(orangeSquare); break;
                case 3: emojiOutput += String.fromCodePoint(greenSquare); break;
            }
        }

        emojiOutput += "\n";
    }

    var output = `${win ? 'CONGRATS' : 'HARD LUCK'}: ${word}\n${emojiOutput}`;

    navigator.clipboard.writeText(output);
    shareAreaAlertDiv.innerHTML = "RESULT HAS BEEN COPIED TO YOUR CLIPBOARD";
}