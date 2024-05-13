const jwt = require("jsonwebtoken");
const { checkPermission } = require("./rbac");
const UserDatabaseStub = require("./database/userDatabaseStub");

const verifyToken = (token) => {
	user = new UserDatabaseStub();
	return user.getById(1);
	//return jwt.verify(token, "secret");
};

const hasPermission = (user, method, path) => {
	const permission = `${method}:${path}`;
	console.log(user.role, method, path)
	//console.log(role, permission, checkPermission(user.role, method, path));

	return checkPermission(user.role, method, path);
};

module.exports = { verifyToken, hasPermission };
