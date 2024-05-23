const express = require('express');
const router = express.Router();
const OrderDetailController = require('../controllers/OrderDetailController');

router.post('/order-detail/:orderID', OrderDetailController.createOrderDetail);

module.exports = router;