class UserDatabaseStub {
	constructor() {
		this.users = [
			{ id: 1, name: "João", email: "joao@example.com" },
			{ id: 2, name: "Maria", email: "maria@example.com" },
			{ id: 3, name: "Pedro", email: "pedro@example.com" },
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
		const index = this.users.findIndex((user) => user.id === id);

		if (index !== -1) {
			this.users[index] = { ...updatedUser, id };
			return true;
		}

		return false;
	}

	delete(id) {
		this.users = this.users.filter((user) => user.id !== id);
	}
}

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