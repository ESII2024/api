const jwt = require("jsonwebtoken");
const rbac = require("./rbac");

const verifyToken = (token) => {
	return { id: 1, name: "User", email: "user@example.com",  role: "user" };
	//return jwt.verify(token, "secret");
};

const hasPermission = (user, method, path) => {
	const role = user.role;
	const permission = `${method}:${path}`;
	console.log(role, permission)

	return rbac[role].includes(permission);
};

module.exports = { verifyToken, hasPermission };
