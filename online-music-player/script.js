const music = document.querySelector("audio");

const img = document.querySelector("img");

const artist = document.getElementById("artist");

const title = document.getElementById("title");

const next = document.getElementById("next");

const previous = document.getElementById("previous");

const play = document.getElementById("play");
const btn2 = document.querySelector(".fa-random");
const btn = document.querySelector(".fa-repeat");
const sleepBtn = document.querySelector("#sleepbtn");
const music_container = document.getElementsByClassName("music_container")[0];
let isPlaying = false;
let songs = []

const playMusic = () => {
  music.play();

  isPlaying = true;

  play.classList.replace("fa-play", "fa-pause");

  img.classList.add("anime");
  music_container.classList.add("glow");
};

const pauseMusic = () => {
  music_container.classList.remove("glow")
  music.pause();

  isPlaying = false;

  play.classList.replace("fa-pause", "fa-play");

  img.classList.remove("anime");
  music_container.classList.remove("glow");
};

play.addEventListener("click", () => {
  isPlaying ? pauseMusic() : playMusic();
});

const loadSong = (song) => {
  title.textContent = song.title;

  artist.textContent = song.artist;

  music.src = song.src;

  img.src = song.image;
};

let songIndex = 0;
//shuffleSong
const shuffleSong = () => {
  const randomNo = Math.floor(Math.random() * songs.length);
  songIndex = randomNo;
  loadSong(songs[songIndex]);
  playMusic();
};
//loadSong(songs[1]);

const nextSong = () => {
  songIndex = (songIndex + 1) % songs.length;

  loadSong(songs[songIndex]);

  playMusic();
};

const prevSong = () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;

  loadSong(songs[songIndex]);

  playMusic();
};

/////////////////////////////////////////////////////////////

btn.addEventListener("click", function () {
  btn2.style.color = "grey";
  btn.style.color = "cyan";
  previous.removeAttribute("onclick", "shuffleSong()");
  next.removeAttribute("onclick", "shuffleSong()");
  previous.setAttribute("onclick", "prevSong()");
  next.setAttribute("onclick", "nextSong()");
  if (btn.classList.contains("fa-repeat")) {
    btn.classList.add("fa-repeat-1");

    btn.classList.remove("fa-repeat");

    //loop song

    music.setAttribute("loop", "");

    music.removeAttribute("onended");
  } else {
    btn.classList.add("fa-repeat");

    btn.classList.remove("fa-repeat-1");

    music.removeAttribute("loop");

    music.setAttribute("onended", "nextSong()");
  }
});
/////////////////////////////////////////////////////////////

btn2.addEventListener("click", function () {
  btn.style.color = "grey";

  if (btn2.style.color == "cyan") {
    btn2.style.color = "grey";
    //play next song
    btn.style.color = "cyan";
    previous.removeAttribute("onclick", "shuflleSong()");
    next.removeAttribute("onclick", "shuffleSong()");
    music.removeAttribute("onended", "shuffleSong()");
    music.setAttribute("onended", "nextSong()");
    previous.setAttribute("onclick", "prevSong()");
    next.setAttribute("onclick", "nextSong()");
  } else {
    btn2.style.color = "cyan";
    //play random songs
    music.removeAttribute("onended", "nextSong()");
    music.setAttribute("onended", "shuffleSong()");
    previous.removeAttribute("onclick", "prevSong()");
    previous.setAttribute("onclick", "shuffleSong()");
    next.removeAttribute("onclick", "nextSong");
    next.setAttribute("onclick", "shuffleSong()");
  }
});
/////////////////////////////
// sleep area
let startSleep;
let usersTime;
function gotoSleep() {
  usersTime = parseInt(sleepBtn[sleepBtn.selectedIndex].value);
  clearInterval(startSleep);
  if (usersTime != 0) {
    alert("Stop audio in " + usersTime + "min");
    startSleep = setInterval(sleep, usersTime * 60 * 1000);
  }
  else {
    alert("Sleep timer off");
  }
}
function sleep() {
  music.play();
  clearInterval(startSleep);
  music.pause();
  sleepBtn.selectedIndex = 0;
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", async (event) => {
  const searchBox = document.getElementById("searchBox");
  const q = searchBox.value.toLowerCase();
  const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${q}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'ef40c740f7mshb4de3995ef42ed5p13273fjsn720d07741f29',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    songs = []
    data["data"].forEach(item => {
      songs.push({
        title: item["title"],
        src: item["preview"],
        image: item["album"]["cover_medium"],
        artist: item["artist"]["name"]
      })
    });
    songIndex = 0;
    loadSong(songs[songIndex]);
    pauseMusic();
  } catch (error) {
    alert(`${q} Not found!`)
  }

});
