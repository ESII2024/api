function createUser(req, res) {
	// Simulação de criação de usuário
	const user = { id: 1, name: "John Doe", email: "john@example.com" };
	res.json(user);
}

function updateUser(req, res) {
	// Simulação de atualização de usuário
	const user = { id: 1, name: "Updated User", email: "updated@example.com" };
	res.json(user);
}

function getUser(req, res) {
	// Simulação de obtenção de usuário
	const user = { id: 1, name: "John Doe", email: "john@example.com" };
	res.json(user);
}

function login(req, res) {
	// Simulação de login
	const token = "mocked_token";
	res.json({ token });
}

module.exports = { createUser, updateUser, getUser, login };
