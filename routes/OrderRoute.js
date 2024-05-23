const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.post('/order', OrderController.initOrder);
router.put('/order/:orderID', OrderController.updateMode);
router.get('/order/:orderID', OrderController.getOrderById);
router.get('/order', OrderController.getListOrder);

module.exports = router;