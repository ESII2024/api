const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes/routes");
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./authMiddleware");
const logger = require("./logger");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(logger);

/** Routes */
app.use("/api", authRoutes);
app.use("/api", authMiddleware, routes);

app.use((err, req, res, next) => {
	if (err.status) {
		res.status(err.status).json({ error: err.message });
	} else {
		res.status(500).json({ error: "A server error occurred" });
	}
	logger(req, res, next);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
