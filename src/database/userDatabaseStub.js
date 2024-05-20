const { JWT_SECRET } = require("../constants");
const jwt = require("jsonwebtoken");

class UserDatabaseStub {
	constructor() {
		this.users = [
			{ id: 1, name: "Lucas Sebastião", email: "lucasmsebastiao@gmail.com", role: "admin", password: "senha" },
			{ id: 2, name: "João", email: "joao@example.com", role: "admin", password: "senha" },
			{ id: 3, name: "Maria", email: "maria@example.com", role: "user", password: "senha" },
			{ id: 4, name: "Pedro", email: "pedro@example.com", role: "user", password: "senha" },
		];
	}

	get(id) {
		const user = this.users.find((user) => user.id === parseInt(id));
		return user ? { ...user } : null;
	}
	update(id, user) {
		id = parseInt(id);
		const index = this.users.findIndex((user) => user.id === id);
		if (index !== -1) {
			const currentUser = this.users[index];
			const updatedUser = {
				id: currentUser.id,
				name: user.name !== null && user.name !== undefined ? user.name : currentUser.name,
				email: user.email !== null && user.email !== undefined ? user.email : currentUser.email,
				role: user.role !== null && user.role !== undefined ? user.role : currentUser.role,
				password: user.password !== null && user.password !== undefined ? user.password : currentUser.password,
			};
			this.users[index] = updatedUser;
			console.log(this.users[index]);
			return this.users[index];
		}

		return { success: true, error: "Utilizador não existe." };
	}

	create(name, email, role, password) {
		const emailExists = this.users.some((existingUser) => existingUser.email === email);
		if (emailExists) {
			return { success: false, message: "Email já está em uso." };
		}

		const newId = this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) + 1 : 1;

		const newUser = {
			id: newId,
			name,
			email,
			role,
			password,
		};

		this.users.push(newUser);

		return { success: true, data: newUser };
	}

	delete(id) {
		this.users = this.users.filter((user) => user.id !== id);
	}

	login(email, password) {
		const user = this.users.find((user) => user.email === email && user.password === password);
		if (user) {
			const token = Math.random().toString(36).substring(7);
			return { user, token };
		} else {
			return null;
		}
	}

	login(email, password) {
		const user = this.users.find((user) => user.email === email && user.password === password);
		if (user) {
			console.log({ id: user.id, email: user.email });
			const token = jwt.sign({ ...user }, JWT_SECRET, { expiresIn: "1h" });
			return { user, token };
		} else {
			return { success: false, message: "Algum dado esta errado." };
		}
	}
}

module.exports = UserDatabaseStub;
