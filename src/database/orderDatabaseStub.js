class UserDatabaseStub {
	constructor() {
		this.orders = [
			{ id: 1, items: ["Item 1", "Item 2"], total: 50.0, user: 1 },
			{ id: 2, items: ["Item 3", "Item 4"], total: 100.0, user: 2 },
			{ id: 3, items: ["Item 5", "Item 6"], total: 150.0, user: 3 },
		];
	}

	getById(id) {
		const order = this.orders.find((order) => order.id === id);
		return order ? { ...order } : null;
	}

	add(newOrder) {
		this.orders.push(newOrder);
	}

	update(id, updatedOrder) {
		const index = this.orders.findIndex((order) => order.id === id);

		if (index !== -1) {
			this.orders[index] = { ...updatedOrder, id };
			return true;
		}

		return false;
	}

	delete(id) {
		this.orders = this.orders.filter((order) => order.id !== id);
	}
}
