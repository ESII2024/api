const jwt = require("jsonwebtoken");
const { checkPermission } = require("./rbac");
const UserDatabaseStub = require("./database/userDatabaseStub");
const { JWT_SECRET } = require("./constants");

const verifyToken = (token) => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded;
	} catch (error) {
		throw error;
	}
};

const hasPermission = (user, method, path) => {
	return checkPermission(user.role, method, path);
};

module.exports = { verifyToken, hasPermission };
