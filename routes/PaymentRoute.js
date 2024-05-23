const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.post('/payment', PaymentController.createPayment);
router.put('/payment/:paymentID', PaymentController.updatePayment);
router.get('/payment', PaymentController.getListPayment);

module.exports = router;