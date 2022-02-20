const util = require("util");
const exec = util.promisify(require("child_process").exec);
let fs = require("fs");
let axios = require("axios");
let youtube = require("youtube-dl-exec");

// all db
let db = null;
let lastSendCount = 0;

(async function () {
	try {
		db = JSON.parse(await fs.promises.readFile("db.json"));
	} catch (e) {
		console.log(e);
	}
})();

async function getVideo(url) {
	videoObj = {};

	let video = await exec(`youtube-dl.exe  --dump-single-json ${url}`);
	

	video = JSON.parse(video.stdout);
	videoObj.title = video.title;
	videoObj.channel = video.channel;
	videoObj.url = video.url;
	videoObj.thumbnail = video.thumbnail;
	videoObj.videoFormats = [];
	videoObj.audioFormats = [];

	for (let x in video.formats) {
		if (video.formats[x].ext == "webm") {
			if (video.formats[x].vcodec == "none") {
				videoObj.audioFormats.push(video.formats[x]);
			} else {
				videoObj.videoFormats.push(video.formats[x]);
			}
		}
	}

	videoObj;
	return videoObj;
}

async function searchVideo(videoList, starIdx) {
	videosData = [];
	let count = 0;
	for (let x = starIdx; x < videoList.length; x++) {
		if (count == 5) {
			break;
		}
		try {
			let video = await getVideo(videoList[x]);
			videosData.push(video);
			count++;
		} catch (e) {
			console.log(e);
		}
	}
	return videosData;
}

async function searchYoutube(str) {
	let videoIds = [];

	// check in db
	let dbRes = searchInDB(str);

	if (dbRes == false) {
		console.log("searching");
		let searchResult = await axios.get(
			`https://youtube.googleapis.com/youtube/v3/search?maxResults=50&type=video&key=AIzaSyDyWImLg5NIqHsJvrKybYOp6T4ww8j3u0w&q=${str}`
		);

		for (let x in searchResult.data.items) {
			if (searchResult.data.items[x].id.kind == "youtube#video")
				videoIds.push(
					`https://www.youtube.com/watch?v=` +
						"" +
						searchResult.data.items[x].id.videoId
				);
		}
		// store all video link details
		db[str] = videoIds;
	}

	videoIds = db[str];
	// get All videos link with details
	lastSendCount = 0;
	let finalRes = await searchVideo(videoIds, 0);

	// set last update time and date
	finalRes["last-update-on"] = Date.now();

	// store dbRes
	await fs.promises.writeFile("db.json", JSON.stringify(db));

	return finalRes;
}

async function loadMore(str) {
	let videoIds = getVideosIds(str);
	if (videoIds) {
		lastSendCount += 5;
		let res = await searchVideo(videoIds, lastSendCount);
		return res;
	} else {
		searchYoutube(str);
	}
}

function getVideosIds(str) {
	return db[str];
}
function searchInDB(str) {
	if (db[str] == null) {
		return false;
	}
	return db[str];
}

module.exports = {
	searchYoutube,
	getVideo,
	loadMore,
};

// searchVideo("https://www.youtube.com/watch?v=o54aKk5LZdM");
