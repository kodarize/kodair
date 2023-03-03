////////////////////////////////////////////////////////////////////////////////
// BEEFAX // BACKGROUND MUSIC                                                 //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External: Song data.
const playlist = [
	// Collection 1: https://archive.org/details/weatherscancompletecollection
	"https://archive.org/download/weatherscancompletecollection/01%20Fair%20Weather.mp3",
	"https://archive.org/download/weatherscancompletecollection/01%20Lazy%20Days.mp3",
	"https://archive.org/download/weatherscancompletecollection/02%20Beach%20Frolic.mp3",
	"https://archive.org/download/weatherscancompletecollection/02%20Good%20Ole%20Days.mp3",
	"https://archive.org/download/weatherscancompletecollection/03%20Jumpin_.mp3",
	"https://archive.org/download/weatherscancompletecollection/03%20Winter%20Tundra.mp3",
	"https://archive.org/download/weatherscancompletecollection/04%20Life.mp3",
	"https://archive.org/download/weatherscancompletecollection/04%20Rainy%20Days.mp3",
	"https://archive.org/download/weatherscancompletecollection/05%20Easy%20Times.mp3",
	"https://archive.org/download/weatherscancompletecollection/05%20Midnight%20Cruise.mp3",
	"https://archive.org/download/weatherscancompletecollection/06%20Evening.mp3",
	"https://archive.org/download/weatherscancompletecollection/06%20Tropical%20Breeze.mp3",
	"https://archive.org/download/weatherscancompletecollection/07%20Going%20Home.mp3",
	"https://archive.org/download/weatherscancompletecollection/07%20Smooth%20Sailing.mp3",
	"https://archive.org/download/weatherscancompletecollection/08%20A%20New%20Day.mp3",
	"https://archive.org/download/weatherscancompletecollection/08%20Brighter%20Days.mp3",
	"https://archive.org/download/weatherscancompletecollection/09%20Reflections%20In%20Time.mp3",
	"https://archive.org/download/weatherscancompletecollection/09%20The%20Setting%20Sun.mp3",
	"https://archive.org/download/weatherscancompletecollection/10%20Do%20You%20Believe.mp3",
	"https://archive.org/download/weatherscancompletecollection/10%20Memories%20Of%20The%20Past.mp3",
	"https://archive.org/download/weatherscancompletecollection/11%20Jamaican%20Jam.mp3",
	"https://archive.org/download/weatherscancompletecollection/11%20Late%20Nite%20Cafe.mp3",
	"https://archive.org/download/weatherscancompletecollection/12%20Good%20Times.mp3",
	"https://archive.org/download/weatherscancompletecollection/12%20The%20End%20Of%20The%20Journey.mp3",
	"https://archive.org/download/weatherscancompletecollection/13%20A%20Little%20Jazz.mp3",
	"https://archive.org/download/weatherscancompletecollection/13%20Care%20Free.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%201.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%202.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%203.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%204.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%205.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%206.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%207.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%208.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%209.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%2010.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%2011.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%2012.mp3",
	"https://archive.org/download/weatherscancompletecollection/Removed%20Weatherscan%20Track%2013.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%201.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%202.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%203.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%204.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%206.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%207.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%208.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2010.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2011.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2012.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2013.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2014.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2016.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2017.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2018.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2019.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2020.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2022.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2023.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2024.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2025.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2026.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2028.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2029.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2030.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2032.mp3",
	"https://archive.org/download/weatherscancompletecollection/Weatherscan%20Track%2033.mp3",
	// Collection 2: https://archive.org/details/floaters-jimmy-fontanez-media-right-productions
	"https://archive.org/download/floaters-jimmy-fontanez-media-right-productions/Floaters%20-%20Jimmy%20Fontanez_Media%20Right%20Productions.mp3"
];
const songs = playlist.length;
let lastTrack = -1;
let musicRetry = null;
const bgmPlayer = document.getElementById('bgm');

// Class.
class Music {

	// Initialization child function.
	static init() {

		// Setup playlist advance.
		// Idea from: https://stackoverflow.com/a/39330684/11018374
		bgmPlayer.addEventListener('ended', () => {
			if (displayMode != "error") {
				this.nextTrack();
			}
		});

		// Setup error correction.
		bgmPlayer.addEventListener('error', (e) => {
			if (
				musicRetry == null && (
					e.target.error.code == e.target.error.MEDIA_ERR_ABORTED ||
					e.target.error.code == e.target.error.MEDIA_ERR_NETWORK ||
					e.target.error.code == e.target.error.MEDIA_ERR_DECODE ||
					e.target.error.code == e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED
				)
			) {
				musicRetry = setTimeout(() => {
					this.nextTrack();
					musicRetry = null;
				}, 1000);
			}
		});

		// Load previous song if needed.
		if (lastTrack == -1 && localStorage.getItem("music.track") && localStorage.getItem("music.position")
			&& Number(localStorage.getItem("music.track")) != NaN && Number(localStorage.getItem("music.position")) != NaN
			&& displayMode != "error"
		) {
			Music.playTrack(Number(localStorage.getItem("music.track")), Number(localStorage.getItem("music.position")));
			return;
		} else {
			Music.nextTrack();
		}

	}

	// Unload child function.
	static unload() {

		// Store track & position.
		if (lastTrack < 0) lastTrack = 0;
		localStorage.setItem("music.track", String(lastTrack));
		localStorage.setItem("music.position", String(bgmPlayer.currentTime));

	}

	// Track play function.
	static playTrack(newTrack, position = 0) {

		// Load & play it.
		bgmPlayer.pause();
		bgmPlayer.src = playlist[newTrack];
		bgmPlayer.load();
		bgmPlayer.currentTime = position;
		setTimeout(() => { bgmPlayer.play() }, 1500);

		// Update.
		lastTrack = newTrack;

	}

	// Next track function.
	static nextTrack() {

		// Pick next song.
		let nextTrack = Math.floor(Math.random() * (playlist.length))+1;
		while (nextTrack == lastTrack) {
			nextTrack = Math.floor(Math.random() * (playlist.length))+1;
		}

		Music.playTrack(nextTrack);

	}

}