function createOrder(req, res) {
	// Simulação de criação de pedido
	const order = { id: 1, items: ["Item 1", "Item 2"], total: 50.0 };
	res.json(order);
}

function getOrder(req, res) {
	// Simulação de obtenção de pedido
	const orderId = req.params.id;
	const order = { id: orderId, items: ["Item 1", "Item 2"], total: 50.0 };
	res.json(order);
}

module.exports = { createOrder, getOrder };
