const { verifyToken, hasPermission } = require("./auth");
const authMiddleware = (req, res, next) => {
	try {
		const headerAuthrorization = req.headers.authorization
		if (headerAuthrorization == null) {
			next({ status: 401, message: "Token does't exist" });
			return;
		}
		const token = headerAuthrorization.replace("Bearer ", "");
		if (token == null) {
		next({ status: 401, message: "Token does't exist" });
			return;
		}
		const decoded = verifyToken(token);
		req.user = decoded;
		if (hasPermission(req.user, req.method, req.originalUrl)) {
			next();
		} else {
			next({ status: 403, message: "Access denied" });
		}
	} catch (err) {
		next({ status: 401, message: "Invalid or expired token" });
	}
};
module.exports = authMiddleware;
