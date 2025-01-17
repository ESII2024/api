const UserDatabaseStub = require("../database/userDatabaseStub");

const dbStub = new UserDatabaseStub();

function createUser(req, res) {
	const { name, email, role, password } = req.body;
	if (!name || !email || !role || !password) {
		res.json({ success: false, message: "Todos os campos são necessários." });
	}
	res.json(dbStub.create(name, email, role, password));
}

function updateUser(req, res) {
	const { id } = req.params;
	res.json(dbStub.update(id, req.body));
}

function getUser(req, res) {
	const { id } = req.params;
	const user = dbStub.get(id);
	if (!user) {
	  return res.status(404).json({ success: false, message: "User not found." });
	}
	res.json(user);
  }
  
function login(req, res) {
	const { email } = req.body;
	const { password } = req.body;
	const data = dbStub.login(email, password);
	res.json(data);
}

module.exports = { createUser, updateUser, getUser, login };
