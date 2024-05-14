const OrderDatabaseStub = require('../database/orderDatabaseStub');

const dbStub = new OrderDatabaseStub();

function createOrder(req, res) {
	// Simulação de criação de pedido
	const order = { id: 1, items: ["Item 1", "Item 2"], total: 50.0 };
	res.json(order);
}

function getOrder(req, res) {
	const orderId = req.params.id;
	res.json(dbStub.getById(parseInt(orderId)));
}

module.exports = { createOrder, getOrder };
