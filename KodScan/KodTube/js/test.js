let axios = require("axios");
let fs = require("fs");

const val = "https://www.youtube.com/watch?v=Df_hrHHcQ_g";
(async function () {
	res = await axios.post(
		"https://video-player-js-api.herokuapp.com/api/getVideo",
		{
			url: val,
		}
	);
	fs.writeFileSync("test.json", JSON.stringify(res.data));
})();
