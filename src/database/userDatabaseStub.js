class UserDatabaseStub {
	constructor() {
		this.users = [
			{ id: 1, name: "João", email: "joao@example.com", role: "admin", password: "senha" },
			{ id: 2, name: "Maria", email: "maria@example.com", role: "user", password: "senha" },
			{ id: 3, name: "Pedro", email: "pedro@example.com", role: "user", password: "senha" },
		];
	}

	getById(id) {
		const user = this.users.find((user) => user.id === id);
		return user ? { ...user } : null;
	}

	add(newUser) {
		this.users.push(newUser);
	}

	update(id, updatedUser) {
		const index = this.users.findIndex((user) => user.id === parseInt(id));
		id = parseInt(id)
		if (index !== -1) {
			this.users[index] = { id, ...updatedUser };
			console.log(this.users[index]);
			return this.users[index];
		}

		return false;
	}

	create(user) {
		if (!user.name || !user.email || !user.role || !user.password) {
            return { success: false, message: "Todos os campos são necessários." };
        }

        const emailExists = this.users.some(existingUser => existingUser.email === user.email);
        if (emailExists) {
            return { success: false, message: "Email já está em uso." };
        }

        const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;

        const newUser = {
            id: newId,
            ...user
        };

        this.users.push(newUser);

        return { success: true, data: newUser };
    }

	delete(id) {
		this.users = this.users.filter((user) => user.id !== id);
	}

	login(email, password) {
		const user = this.users.find(user => user.email === email && user.password === password);
		if (user) {
			const token = Math.random().toString(36).substring(7);
			return { user, token };
		} else {
			return null;
		}
	}
}

module.exports = UserDatabaseStub;
