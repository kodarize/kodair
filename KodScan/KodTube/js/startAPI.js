const util = require("util");
const exec = require("child_process").exec;
module.exports = { starAPI };

 function starAPI() {
	exec("node app.js");
}
