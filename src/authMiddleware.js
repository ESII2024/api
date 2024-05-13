const { verifyToken, hasPermission } = require("./auth");
const authMiddleware = (req, res, next) => {
	const token = "x"/*req.headers.authorization*/;
	if (token == null) {
		next({ status: 401, message: "Invalid or expired token" });
		return;
	}
	try {
		console.log("ola10");
		const decoded = verifyToken(token);
		console.log("ola12");
		req.user = decoded;
		console.log("ola1");
		if (hasPermission(req.user, req.method, req.path)) {
			console.log("ola2");
			next();
		} else {
			console.log("ola3");
			throw { status: 403, message: "Access denied" };
		}
	} catch (err) {
			console.log("fds");
			next({ status: 401, message: "Invalid or expired token" });
	}
};
module.exports = authMiddleware;
