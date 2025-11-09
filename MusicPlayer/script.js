document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseButton = document.getElementById('playPauseButton');
    const progressBar = document.getElementById('progressBar');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const volumeControl = document.getElementById('volumeControl');
    const albumArt = document.getElementById('albumArt');
    const songTitle = document.getElementById('songTitle');
    const artistName = document.getElementById('artistName');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsList = document.getElementById('resultsList');
    const currentPlaylistUl = document.getElementById('currentPlaylist');
    const clearPlaylistButton = document.getElementById('clearPlaylistButton');

    let currentPlaylist = [];
    let currentSongIndex = -1;
    let isPlaying = false; // Track player state

    // --- Utility Functions ---
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updatePlayerDisplay(song = {}) {
        albumArt.src = song.thumbnail || 'placeholder.png';
        songTitle.textContent = song.title || 'No song playing';
        artistName.textContent = song.artist || 'No artist';
        // Reset time and progress bar
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';
        progressBar.value = 0;
    }

    function loadAndPlaySong(song) {
        if (!song || !song.audioUrl) {
            alert('Could not get audio URL for this song. It might be unavailable or the unofficial method failed.');
            console.error("Invalid song object or missing audio URL:", song);
            isPlaying = false;
            playPauseButton.textContent = '▶️';
            updatePlayerDisplay(); // Clear display
            return;
        }
        audioPlayer.src = song.audioUrl;
        audioPlayer.load(); // Load the new song
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                playPauseButton.textContent = '⏸️';
                updatePlayerDisplay(song);
                // Update the highlight in the playlist
                renderPlaylist();
            })
            .catch(error => {
                console.error("Error playing audio:", error);
                alert("Failed to play song. It might be blocked or an error occurred.");
                isPlaying = false;
                playPauseButton.textContent = '▶️';
                updatePlayerDisplay(); // Clear display
            });
    }

    function playNextSong() {
        if (currentPlaylist.length === 0) {
            updatePlayerDisplay();
            isPlaying = false;
            playPauseButton.textContent = '▶️';
            return;
        }
        currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
        loadAndPlaySong(currentPlaylist[currentSongIndex]);
    }

    function playPrevSong() {
        if (currentPlaylist.length === 0) return;
        if (audioPlayer.currentTime > 3) { // Restart song if playing for more than 3 seconds
            audioPlayer.currentTime = 0;
            audioPlayer.play();
            return;
        }
        currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        loadAndPlaySong(currentPlaylist[currentSongIndex]);
    }

    // --- Player Controls ---
    playPauseButton.addEventListener('click', () => {
        if (currentPlaylist.length === 0 && currentSongIndex === -1) {
            alert("Please add a song to the playlist first.");
            return;
        }

        if (audioPlayer.paused && !isPlaying) { // If paused or initial state
            if (currentSongIndex === -1) { // If no song loaded, load first from playlist
                currentSongIndex = 0;
            }
            loadAndPlaySong(currentPlaylist[currentSongIndex]);
        } else if (audioPlayer.paused && isPlaying) { // If paused after playing
            audioPlayer.play()
                .then(() => {
                    isPlaying = true;
                    playPauseButton.textContent = '⏸️';
                })
                .catch(error => console.error("Error resuming playback:", error));
        } else { // If playing
            audioPlayer.pause();
            isPlaying = false;
            playPauseButton.textContent = '▶️';
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
        progressBar.max = audioPlayer.duration; // Set max to actual duration for accurate progress
    });

    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        playPauseButton.textContent = '▶️';
        playNextSong(); // Auto-play next song
    });

    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    progressBar.addEventListener('change', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    // Initialize volume to max
    audioPlayer.volume = volumeControl.value;
    updatePlayerDisplay(); // Set initial display


    // --- Unofficial YouTube Search and Audio Extractor ---
    // IMPORTANT: This part uses an unofficial way to get direct audio links from YouTube.
    // It is prone to breaking, violates YouTube's ToS for production use, and is for demonstration only.
    // A robust solution requires a backend that uses YouTube Data API (for search)
    // and then potentially a third-party YouTube download library (like youtube-dl, yt-dlp)
    // on the server side to extract direct audio URLs, which also has legal implications.

    const YOUTUBE_SEARCH_API_URL = "https://www.youtube.com/results?search_query=";

    async function searchYouTube(query) {
        resultsList.innerHTML = '<li>Searching YouTube...</li>';
        try {
            // Use a CORS proxy if running locally, otherwise browser will block YouTube fetch.
            // THIS IS NOT FOR PRODUCTION!
            const corsProxy = 'https://api.allorigins.win/get?url='; // Example CORS proxy (unreliable for production)
            const url = `${corsProxy}${encodeURIComponent(YOUTUBE_SEARCH_API_URL + encodeURIComponent(query))}`;

            const response = await fetch(url);
            const data = await response.json(); // For allorigins, response is JSON with 'contents' field
            const html = data.contents; // Get the actual HTML

            // Use a DOMParser to safely parse the HTML string
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const scriptTags = doc.querySelectorAll('script');
            let ytInitialData = null;

            // Find the script tag containing 'ytInitialData'
            for (let script of scriptTags) {
                if (script.textContent.includes('ytInitialData')) {
                    const match = script.textContent.match(/var ytInitialData = ({.*?});/);
                    if (match && match[1]) {
                        ytInitialData = JSON.parse(match[1]);
                        break;
                    }
                }
            }

            if (!ytInitialData) {
                console.error("ytInitialData not found in YouTube page.");
                resultsList.innerHTML = '<li>Error: Could not parse YouTube data.</li>';
                return [];
            }

            // Extract videos from the YouTube initial data structure
            // This structure can change, making this brittle.
            const contents = ytInitialData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;

            if (!contents) {
                console.warn("No video contents found in YouTube search results structure.");
                resultsList.innerHTML = '<li>No search results found.</li>';
                return [];
            }

            const videos = [];
            for (let item of contents) {
                const videoRenderer = item.videoRenderer;
                if (videoRenderer) {
                    const videoId = videoRenderer.videoId;
                    const title = videoRenderer.title?.runs?.[0]?.text;
                    const channelName = videoRenderer.ownerText?.runs?.[0]?.text;
                    const thumbnailUrl = videoRenderer.thumbnail?.thumbnails?.[0]?.url;

                    if (videoId && title && channelName) {
                        videos.push({
                            id: videoId,
                            title: title,
                            artist: channelName,
                            thumbnail: thumbnailUrl
                        });
                    }
                }
            }
            return videos;

        } catch (error) {
            console.error("Error fetching or parsing YouTube search results:", error);
            resultsList.innerHTML = '<li>Error: Failed to fetch search results. Check console for details.</li>';
            return [];
        }
    }

    async function getYouTubeAudioUrl(videoId) {
        // This relies on an external, community-maintained API that extracts direct audio links.
        // Again, this is not official, not guaranteed to work, and prone to breaking.
        const extractorApi = `https://co.wuk.sh/api/json`; // Example: Co.Wuk.sh or similar

        try {
            const response = await fetch(extractorApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    isAudioOnly: true,
                    // You might want to specify format/quality if the API supports it
                    // 'format': 'mp3' or 'm4a', 'quality': 'highestaudio'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`Extractor API error: ${response.status} ${response.statusText}`, errorData);
                return null;
            }

            const data = await response.json();
            if (data.url) {
                return data.url; // This is the direct audio URL
            } else {
                console.error("No audio URL found in extractor API response:", data);
                return null;
            }
        } catch (error) {
            console.error("Error fetching audio URL from extractor API:", error);
            return null;
        }
    }


    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query) {
            resultsList.innerHTML = '<li>Searching...</li>';
            const results = await searchYouTube(query);

            resultsList.innerHTML = ''; // Clear previous results
            if (results.length > 0) {
                results.forEach(song => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span>${song.title} - ${song.artist}</span>
                        <button data-id="${song.id}" data-title="${song.title}" data-artist="${song.artist}" data-thumbnail="${song.thumbnail}">Add & Play</button>
                    `;
                    resultsList.appendChild(listItem);
                });
            } else {
                resultsList.innerHTML = '<li>No results found.</li>';
            }
        }
    });

    resultsList.addEventListener('click', async (event) => {
        if (event.target.tagName === 'BUTTON') {
            const button = event.target;
            const videoId = button.dataset.id;
            const title = button.dataset.title;
            const artist = button.dataset.artist;
            const thumbnail = button.dataset.thumbnail;

            button.textContent = 'Loading...';
            button.disabled = true;

            const audioUrl = await getYouTubeAudioUrl(videoId);

            button.textContent = 'Add & Play';
            button.disabled = false;

            if (audioUrl) {
                const song = {
                    id: videoId,
                    title: title,
                    artist: artist,
                    thumbnail: thumbnail,
                    audioUrl: audioUrl
                };
                addToPlaylist(song);
                // Optionally auto-play the added song
                currentSongIndex = currentPlaylist.length - 1; // Set to the newly added song
                loadAndPlaySong(currentPlaylist[currentSongIndex]);
            } else {
                alert(`Could not get audio for "${title}". Try another song.`);
            }
        }
    });


    // --- Playlist Management ---
    function addToPlaylist(song) {
        // Prevent duplicate songs by ID
        if (!currentPlaylist.some(s => s.id === song.id)) {
            currentPlaylist.push(song);
            renderPlaylist();
            console.log("Added to playlist:", song.title);
        } else {
            alert(`${song.title} is already in the playlist!`);
        }
    }

    function renderPlaylist() {
        currentPlaylistUl.innerHTML = '';
        if (currentPlaylist.length === 0) {
            currentPlaylistUl.innerHTML = '<li>No songs in playlist. Add from search results.</li>';
            return;
        }
        currentPlaylist.forEach((song, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="${index === currentSongIndex ? 'current-song' : ''}">${song.title} - ${song.artist}</span>
                <div>
                    <button class="play-from-playlist" data-index="${index}">Play</button>
                    <button class="remove-from-playlist" data-index="${index}">X</button>
                </div>
            `;
            currentPlaylistUl.appendChild(listItem);
        });
    }

    currentPlaylistUl.addEventListener('click', (event) => {
        if (event.target.classList.contains('play-from-playlist')) {
            const index = parseInt(event.target.dataset.index);
            if (!isNaN(index) && index >= 0 && index < currentPlaylist.length) {
                currentSongIndex = index;
                loadAndPlaySong(currentPlaylist[currentSongIndex]);
            }
        } else if (event.target.classList.contains('remove-from-playlist')) {
            const indexToRemove = parseInt(event.target.dataset.index);
            if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < currentPlaylist.length) {
                // Adjust current song index if the removed song was before it
                if (indexToRemove < currentSongIndex) {
                    currentSongIndex--;
                } else if (indexToRemove === currentSongIndex) {
                    // If current song is removed, pause and handle next/previous in playlist
                    audioPlayer.pause();
                    isPlaying = false;
                    playPauseButton.textContent = '▶️';
                    if (currentPlaylist.length > 1) { // If there are other songs, try to play next
                        currentSongIndex = (indexToRemove + 1) % currentPlaylist.length;
                        if (currentSongIndex >= currentPlaylist.length || currentPlaylist.length === 1) { // If it was the last song (or only one) and removed
                           currentSongIndex = 0; // Point to start, or -1 if list becomes empty
                           if (currentPlaylist.length === 0) currentSongIndex = -1;
                        }
                        // Do not auto-play, just update index
                    } else { // Playlist will be empty
                        currentSongIndex = -1;
                        updatePlayerDisplay();
                    }
                }
                currentPlaylist.splice(indexToRemove, 1);
                renderPlaylist();
                // If the playlist became empty or the current song was removed and no next song could be loaded, clear display
                if (currentPlaylist.length === 0 || currentSongIndex === -1) {
                    updatePlayerDisplay();
                } else if (currentSongIndex !== -1 && !isPlaying) { // If current song changed but not playing, update display to new song info
                    updatePlayerDisplay(currentPlaylist[currentSongIndex]);
                }
            }
        }
    });

    clearPlaylistButton.addEventListener('click', () => {
        const confirmClear = confirm("Are you sure you want to clear the playlist?");
        if (confirmClear) {
            currentPlaylist = [];
            currentSongIndex = -1;
            audioPlayer.pause();
            audioPlayer.src = ''; // Clear audio source
            isPlaying = false;
            playPauseButton.textContent = '▶️';
            updatePlayerDisplay();
            progressBar.value = 0;
            currentTimeSpan.textContent = '0:00';
            durationSpan.textContent = '0:00';
            renderPlaylist();
        }
    });

    renderPlaylist(); // Render initial empty playlist
});