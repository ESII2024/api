const UserDatabaseStub = require('../database/userDatabaseStub'); // Certifica-te de que o caminho está correto

// Cria uma instância global do stub
const dbStub = new UserDatabaseStub();

function createUser(req, res) {
	//const user = { id: 1, name: "John Doe", email: "john@example.com" };
	res.json(dbStub.getById(1));
}

function updateUser(req, res) {
	//const user = { id: 1, name: "Updated User", email: "updated@example.com",  role: "user" };
	
	res.json(dbStub.update(req.params.id, req.body));
}

function getUser(req, res) {
	// Simulação de obtenção de usuário
	const user = { id: 1, name: "John Doe", email: "john@example.com", role: "admin" };
	res.json(user);
}

function login(req, res) {
	// Simulação de login
	const token = "mocked_token";
	res.json({ token });
}

module.exports = { createUser, updateUser, getUser, login };
