class OrderDatabaseStub {
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

	create(newOrder) {
		const newId = this.orders.length ? Math.max(...this.orders.map((order) => order.id)) + 1 : 1;
		const orderToAdd = { id: newId, ...newOrder };
		this.orders.push(orderToAdd);
        return { success: true, data: orderToAdd };
	}
}

module.exports = OrderDatabaseStub;
