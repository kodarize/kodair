document.addEventListener("DOMContentLoaded", function(event) {
  //SET UP AUDIO CONTEXT
  const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
  //PROCESSING CHAIN
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  //CURRENT WAVEFORM OSCILLATOR WILL USE
  let waveform = 'sawtooth'
  //OBJECT FOR STORING ACTIVE NOTES
  const activeOscillators = {};
  //KEYCODE TO MUSICAL FREQUENCY CONVERSION
  const keyboardFrequencyMap = {
    '65': 69.295657744218024, //A - C#
    '90': 73.416191979351890, //Z - D
    '83': 77.781745930520227, //S - D#
    '88': 82.406889228217482, //X - E
    '67': 87.307057858250971, //C - F
    '70': 92.498605677908599, //F- F#
    '86': 97.998858995437323, //V - G
    '71': 103.826174394986284, //G - G#
    '66': 110.000000000000000, //B - A
    '72': 116.540940379522479, //H - A#
    '78': 123.470825314031027, //N - B
    '77': 130.812782650299317, //M - C
    '75': 138.591315488436048, //K - C#
    '188': 146.832383958703780, //, - D
    '76': 155.563491861040455, //L - D#
    '190': 164.813778456434964, //. - E
    '191': 174.614115716501942, //SLASH - F
    '222': 184.997211355817199, //SINGLEQUOTE - F#
    '49': 184.997211355817199, //1 - ALSO F#
    '81': 195.997717990874647, //Q - G
    '50': 207.652348789972569, //2 - G#
    '87': 220.000000000000000, //W - A
    '51': 233.081880759044958, //3 - A#
    '69': 246.941650628062055, //E - B
    '82': 261.625565300598634, //R - Middle C
    '53': 277.182630976872096, //5 - C#
    '84': 293.664767917407560, //T - D
    '54': 311.126983722080910, //6 - D#
    '89': 329.627556912869929, //Y - E
    '85': 349.228231433003884, //U - F
    '56': 369.994422711634398, //8 - F#
    '73': 391.995435981749294, //I - G
    '57': 415.304697579945138, //9 - G#
    '79': 440.000000000000000, //O - A
    '48': 466.163761518089916, //0 - A#
    '80': 493.883301256124111, //P - B
    '219': 523.251130601197269, //BRACKET1 - C
    '187': 554.365261953744192, //EQUAL - C#
    '221': 587.329535834815120, //BRACKET2 - D
  }
  //CONNECTIONS
  gain.connect(filter);
  filter.connect(audioCtx.destination);
  //EVENT LISTENERS FOR SYNTH PARAMETER INTERFACE
  const waveformControl = document.getElementById('waveform')
  waveformControl.addEventListener('change', function(event) {
    waveform = event.target.value
  });
  const gainControl = document.getElementById('gain')
  gainControl.addEventListener('change', function(event) {
    gain.gain.setValueAtTime(event.target.value, audioCtx.currentTime)
  });
  const filterTypeControl = document.getElementById('filterType')
  filterTypeControl.addEventListener('change', function(event) {
    filter.type = event.target.value
  });
  const filterFrequencyControl = document.getElementById('filterFrequency')
  filterFrequencyControl.addEventListener('change', function(event) {
    filter.frequency.setValueAtTime(event.target.value, audioCtx.currentTime)
  });
  //EVENT LISTENERS FOR MUSICAL KEYBOARD
  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);		
  //CALLED ON KEYDOWN EVENT - CALLS PLAYNOTE IF KEY PRESSED IS ON MUSICAL
  //KEYBOARD && THAT KEY IS NOT CURRENTLY ACTIVE
  function keyDown(event) {
    if (event.getModifierState("CapsLock")) {
      if (event.getModifierState("Shift")) {
		  document.getElementById('audiox' + event.keyCode).play();
	  } else {
		  document.getElementById('audio' + event.keyCode).play();
	  }
    } else {
      const key = (event.detail || event.which).toString();
      if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
        playNote(key);
      }
    }

  }
  //STOPS & DELETES OSCILLATOR ON KEY RELEASE IF KEY RELEASED IS ON MUSICAL
  //KEYBOARD && THAT KEY IS CURRENTLY ACTIVE
  function keyUp(event) {
    if (event.getModifierState("CapsLock")) {
		if (event.getModifierState("Shift")) {
		  document.getElementById('audiox' + event.keyCode).pause();
      document.getElementById('audiox' + event.keyCode).currentTime = 0;
	  } else {
		  document.getElementById('audio' + event.keyCode).pause();
      document.getElementById('audio' + event.keyCode).currentTime = 0;
	  }
    } else {
      const key = (event.detail || event.which).toString();
      if (keyboardFrequencyMap[key] && activeOscillators[key]) {
        activeOscillators[key].stop();
        delete activeOscillators[key];
      }
    }

  }
  //HANDLES CREATION & STORING OF OSCILLATORS
  function playNote(key) {
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
    osc.type = waveform
    activeOscillators[key] = osc
    activeOscillators[key].connect(gain)
    activeOscillators[key].start();
  }
});

function OnButtonDown (button) {
window.dispatchEvent(new KeyboardEvent('keydown', {
  key: button.innerHTML,
  keyCode: button.value,
  which: button.value,
  modifierCapsLock: true
}));
};

function OnButtonUp (button) {
window.dispatchEvent(new KeyboardEvent('keyup', {
  key: button.innerHTML,
  keyCode: button.value,
  which: button.value,
  modifierCapsLock: true
}));
};