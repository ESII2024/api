const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");

router.post("/user", userController.createUser);
router.put("/user/:id", userController.updateUser);
router.get("/user/:id", userController.getUser);

router.post("/order", orderController.createOrder);
router.get("/order/:id", orderController.getOrder);

module.exports = router;
