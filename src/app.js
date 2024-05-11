const express = require("express");
const app = express();
const routes = require("./routes");
const authMiddleware = require("./authMiddleware");
const logger = require("./logger");

app.use(express.json());
app.use(logger);
app.use("/api", authMiddleware, routes);

app.use((err, req, res, next) => {
	if (err.status) {
		res.status(err.status).json({ error: err.message });
	} else {
		res.status(500).json({ error: "A server error occurred" });
	}
	logger.error(err.stack);
});

const PORT = process.env.PORT || 3000;

app.use("/", routes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
