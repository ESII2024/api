const fs = require("fs");

function logger(req, res, next) {
	const logStream = fs.createWriteStream("access.log", { flags: "a" });

	const log = `${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode}`;
	logStream.write(log + "\n");

	next();
}

module.exports = logger;
