const OrderDatabaseStub = require('../database/orderDatabaseStub');

const dbStub = new OrderDatabaseStub();

function createOrder(req, res) {
	const { items, total, user } = req.body;
	if (!items || !total || !user) {
		res.json({ success: false, message: "Todos os campos são necessários." });
	}
	res.json(dbStub.create(req.body));
}

function getOrder(req, res) {
	const orderId = req.params.id;
	res.json(dbStub.get(parseInt(orderId)));
}

module.exports = { createOrder, getOrder };
