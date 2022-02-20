const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const app = express();
const port = 3000;
const getData = require("./getData");

app.use(cors("*"));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/api/getVideo", (req, res) => {
	console.log(req.body.url);

	getData.getVideo(req.body.url).then(function (data) {
		res.send(data);
		// console.log(data);
	});
	// console.log(rep);
});

app.post("/api/search", (req, res) => {
	// console.log(req.body.str);
	getData.searchYoutube(req.body.str).then(function (data) {
		res.send(data);
	});
});

app.post("/api/load", (req, res) => {
	// console.log(req.body.str);
	getData.loadMore(req.body.str).then(function (data) {
		res.send(data);
	});
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
