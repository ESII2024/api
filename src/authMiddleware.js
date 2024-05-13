const { verifyToken, hasPermission } = require("./auth");
const authMiddleware = (req, res, next) => {
	const token = "x"; /*req.headers.authorization*/
	if (token == null) {
		next({ status: 401, message: "Token does't exist" });
		return;
	}
	try {
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
