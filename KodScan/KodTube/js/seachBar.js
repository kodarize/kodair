let searchInput = document.querySelector("#searchInput");
let searchRes = document.querySelector("#search-result");

searchRes.classList.add("hideControl");

searchInput.addEventListener("keypress", async function (e) {
	let val = searchInput.value;
	if (e.key == "Enter") {
		// console.log("Called Api");

		if (isUrl(val)) {
			directVideo(val);
		} else {
			youtubeSearch(val);
		}
	}
});

searchInput.onfocus = function () {
	let b = this.getBoundingClientRect();
	searchRes.classList.remove("hideControl");
	// set result box position
	searchRes.style.top = b.top + b.height + "px";
	searchRes.style.right = 20 + "px";
	searchRes.style.width = "35%";
	searchRes.style.height = "30vh";

	isTyping = true;
};
searchInput.onblur = function () {
	searchRes.classList.add("hideControl");
	setTimeout(() => {}, 300);
	isTyping = false;
};

async function directVideo(val) {
	// !! localhost
	// res = await axios.post("http://localhost:3000/api/getVideo", {
	// 	url: val,
	// });
	// !! server
	res = await axios.post(
		"https://video-player-js-api.herokuapp.com/api/getVideo",
		{
			url: val,
		}
	);

	videoObj = res.data;
	ctime = 0;
	searchInput.value = "";
	searchInput.blur();
	formatFormats();
	setVideoAndAudio();
}

async function youtubeSearch(val) {
	// console.log("Not url");
	searchRes.innerHTML = `<div class="loader-search"></div>`;
	searchRes.classList.remove("hideControl");
	let l = searchRes.querySelector(".loader-search");
	l.classList.remove("hideControl");
	// !! for testing
	// res = await axios.post("http://localhost:3000/api/search", {
	// 	str: val,
	// });
	// !! Server
	res = await axios.post(
		"https://video-player-js-api.herokuapp.com/api/search",
		{
			str: val,
		}
	);

	if (res.data.length == 0) {
		searchRes.innerHTML = `<p> No data found !</p>`;
		return;
	}
	l.classList.add("hideControl");
	// div = `<div class="loader"></div>`;

	for (let x = 0; x < 6; x++) {
		appendList(x, res);
	}
}

async function addMoreResult(e) {
	searchInput.focus();

	e.target.innerHTML = `<div class="loader-search"></div>`;
	e.target.style.height = "40px";
	// !! localhost for testing
	// let moreRes = await axios.post("http://localhost:3000/api/load", {
	// 	str: searchInput.value,
	// });
	// !! server
	let moreRes = await axios.post(
		"https://video-player-js-api.herokuapp.com/api/load",
		{
			str: searchInput.value,
		}
	);

	if (moreRes.data.length != 0) {
		e.target.remove();
	} else {
		e.target.textContent = `No data found !`;
	}

	for (let x = 0; x < 6; x++) {
		appendList(x, moreRes);
	}
}

function appendList(x, res) {
	let d = document.createElement("div");

	if (x == 5) {
		d.classList.add("list-view-load-more");
		d.textContent = `Load More..`;
		d.addEventListener("click", addMoreResult);
	} else {
		d.classList.add("list-view");
		d.innerHTML = `	<div class="thumbnail"></div>
						<div class="search-title">
							${res.data[x].title}
							<div class="channel-title">${res.data[x].channel}</div>
						</div>
					`;

		d.querySelector(
			".thumbnail"
		).style.background = `url(${res.data[x].thumbnail})`;
		d.addEventListener("click", function () {
			ctime = 0;

			videoObj = res.data[x];
			formatFormats();
			setVideoAndAudio();
		});
	}
	searchRes.appendChild(d);
}
