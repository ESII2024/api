const jwt = require("jsonwebtoken");
const rbac = require("./rbac");

const verifyToken = (token) => {
	return jwt.verify(token, "secret");
};

const hasPermission = (user, method, path) => {
	const role = user.role;
	const permission = `${method}:${path}`;
	return rbac[role].includes(permission);
};

module.exports = { verifyToken, hasPermission };
