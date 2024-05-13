class UserDatabaseStub {
	constructor() {
		this.users = [
			{ id: 1, name: "João", email: "joao@example.com", role: "admin" },
			{ id: 2, name: "Maria", email: "maria@example.com", role: "user" },
			{ id: 3, name: "Pedro", email: "pedro@example.com", role: "user" },
		];
	}

	getById(id) {
		const user = this.users.find((user) => user.id === id);
		return user ? { ...user } : null;
	}

	getByEmail(email) {
		const user = this.users.find((user) => user.email === email);
		return user ? { ...user } : null;
	}

	add(newUser) {
		this.users.push(newUser);
	}

	update(id, updatedUser) {
		console.log(id, updatedUser)
		const index = this.users.findIndex((user) => user.id === parseInt(id));

		console.log(id, index, this.users)

		if (index !== -1) {
			this.users[index] = { id, ...updatedUser };
			console.log(this.users[index])
			return this.users[index];
		}

		return false;
	}

	delete(id) {
		this.users = this.users.filter((user) => user.id !== id);
	}
}

module.exports = UserDatabaseStub;

/*const dbStub = new UserDatabaseStub();
console.log(dbStub.getUserById(2));
console.log(dbStub.getUserByEmail("joao@example.com"));

dbStub.addUser({ id: 4, name: "Ana", email: "ana@example.com" });
console.log(dbStub.users);

dbStub.updateUser(3, { name: "Pedro Silva", email: "pedro.silva@example.com" });
console.log(dbStub.getUserById(3));

dbStub.deleteUser(1);
console.log(dbStub.users);
*/