const UserDatabaseStub = require("../database/userDatabaseStub");

const dbStub = new UserDatabaseStub();

function createUser(req, res) {
	res.json(dbStub.create(req.body));
}

function updateUser(req, res) {
	res.json(dbStub.update(req.params.id, req.body));
}

function getUser(req, res) {
	res.json(dbStub.getById(parseInt(req.params.id)));
}

function login(req, res) {
	const { email } = req.body;
	const { password } = req.body;
	const data = dbStub.login(email, password);
	res.json(data);
}

module.exports = { createUser, updateUser, getUser, login };
