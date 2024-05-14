const rbac = {
	admin: ["GET:/api/user/*", "POST:/api/user", "PUT:/api/user/*", "POST:/api/login", "POST:/api/order", "GET:/api/order/*"],
	user: ["GET:/api/user/*", "PUT:/api/user/*", "POST:/api/order", "GET:/api/order/*"],
};

function checkPermission(role, method, url) {
	if (rbac.hasOwnProperty(role)) {
		const rolePermissions = rbac[role];
		for (let i = 0; i < rolePermissions.length; i++) {
			const permission = rolePermissions[i].split(":");
			const permissionMethod = permission[0];
			const permissionUrl = permission[1];

			if (permissionMethod.toUpperCase() === method.toUpperCase()) {
				if (permissionUrl.endsWith("*")) {
					const trimmedPermissionUrl = permissionUrl.substring(0, permissionUrl.length - 1);
					if (url.startsWith(trimmedPermissionUrl)) {
						return true;
					}
				} else if (permissionUrl === url) {
					return true;
				}
			}
		}
	}
	return false; // Se nenhum match for encontrado, retorna falso
}

module.exports = { rbac, checkPermission };
