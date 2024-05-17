const OrderDatabaseStub = require('../database/orderDatabaseStub');

const dbStub = new OrderDatabaseStub();

function createOrder(req, res) {
	// Simulação de criação de pedido
	res.json(dbStub.create(req.body));
}

function getOrder(req, res) {
	const orderId = req.params.id;
	res.json(dbStub.get(parseInt(orderId)));
}

module.exports = { createOrder, getOrder };
