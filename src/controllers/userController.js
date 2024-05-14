const UserDatabaseStub = require('../database/userDatabaseStub');

const dbStub = new UserDatabaseStub();

function createUser(req, res) {
	res.json(dbStub.getById(1));
}

function updateUser(req, res) {
	res.json(dbStub.update(req.params.id, req.body));
}

function getUser(req, res) {
	res.json(dbStub.getById(parseInt(req.params.id)));
}

function login(req, res) {
	// Simulação de login
	const token = "mocked_token";
	res.json({ token });
}

module.exports = { createUser, updateUser, getUser, login };
