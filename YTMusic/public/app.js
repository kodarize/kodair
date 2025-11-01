// app.js

let currentVideoId = null;
let player = null;

function onYouTubeIframeAPIReady() {
  // This function is called when the YouTube API script is loaded and ready
  player = new YT.Player('youtube-player', {
    height: '0',  // Set the height to 0 to hide the video
    width: '0',   // Set the width to 0 to hide the video
    playerVars: {
      autoplay: 1,  // Auto-play the video when loaded
      controls: 0,  // Hide video controls
      modestbranding: 1,  // Hide YouTube logo
      showinfo: 0,  // Hide video info
      rel: 0,  // Prevent showing related videos after the video ends
      fs: 0,  // Disable fullscreen button
      mute: 1,  // Mute the video to only hear audio
    },
    events: {
      onReady: (event) => {
        console.log("YouTube player is ready");
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          playNext();
        }
      }
    }
  });
}

async function searchSong() {
  const query = document.getElementById('search-input').value;
  try {
    const response = await fetch(`/api/search?query=${query}`);
    const data = await response.json();
    if (data.length > 0) {
      currentVideoId = data[0].id.videoId;
      playAudio(currentVideoId);
    } else {
      alert('No results found');
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

async function playNext() {
  try {
    const response = await fetch(`/api/related?videoId=${currentVideoId}`);
    const data = await response.json();
    if (data.length > 0) {
      currentVideoId = data[0].id.videoId;
      playAudio(currentVideoId);
    } else {
      alert('No similar songs found');
    }
  } catch (error) {
    console.error('Error fetching related song:', error);
  }
}

function playAudio(videoId) {
  if (player) {
    player.loadVideoById(videoId);
  }
}