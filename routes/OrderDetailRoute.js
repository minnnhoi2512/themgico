const express = require('express');
const router = express.Router();
const OrderDetailController = require('../controllers/OrderDetailController');

router.post('/order-detail/:orderID', OrderDetailController.createOrderDetail);
router.put('/order-detail/:id', OrderDetailController.updateOrderDetail);
router.delete('/order-detail/:id', OrderDetailController.deleteOrderDetail);

module.exports = router;