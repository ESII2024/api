const { verifyToken, hasPermission } = require("./auth");
const authMiddleware = (req, res, next) => {
	const token = req.headers.authorization;
	try {
		const decoded = verifyToken(token);
		req.user = decoded;
		if (hasPermission(req.user, req.method, req.path)) {
			next();
		} else {
			throw { status: 403, message: "Access denied" };
		}
	} catch (err) {
		next({ status: 401, message: "Invalid or expired token" });
	}
};
module.exports = authMiddleware;
