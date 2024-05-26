const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.post('/payment', PaymentController.createPayment);
router.put('/payment/:paymentID', PaymentController.payPayment);
router.post('/payment/:paymentID', PaymentController.cancelPayment);
router.get('/payment', PaymentController.getListPayment);

module.exports = router;