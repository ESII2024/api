const rbac = {
	admin: ["GET:/api/user", "POST:/api/user", "PUT:/api/user", "POST:/api/login", "POST:/api/order", "GET :/api/order/*"],
	user: ["GET:/api/user", "PUT:/api/user", "POST:/api/order", "GET:/api/order/*"],
};

module.exports = rbac;
