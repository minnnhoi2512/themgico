const connect = require('../database/connect');
const OrderController = require('./OrderController');
const CustomerController = require('./CustomerController');
const PayOS = require('@payos/node');

const payOS = new PayOS('915c4d40-fbc2-4303-ae69-63b6aead519e', '069ce960-29ab-465b-8760-960f2f9cf382', '6d52b06eee7299173400db3fd7c696c1e85b6610de9ee1029c2e2821e2e1eef6');





const createPayment = async (req, res, next) => {
    const { name, phone, orderID } = req.body;
    const paymentDate = new Date(); // Get the current date and time
    const pool = await connect();

    try {
        let order = null;
        const customer = await CustomerController.findCustomerByPhone(phone);

        if (customer == null && phone != "None") {
            await CustomerController.createCustomer(name, phone);
            order = await OrderController.findOrderById(orderID);
        } else {
            order = await OrderController.findOrderById(orderID);
        }

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Calculate the payment amount from the order's total
        const amount = order.Total;

        // Construct items array from order details
        const items = order.orderDetails.map(detail => ({
            name: detail.productName,
            quantity: detail.quantity,
            price: detail.price
        }));

        const result = await pool.request()
            .input('orderID', orderID)
            .input('paymentMethod', 'None')
            .input('amount', amount)
            .input('phone', phone)
            .input('paymentDate', paymentDate)
            .input('status', false) // Assuming status is a boolean indicating payment status
            .query(`
                INSERT INTO Payment (orderID, paymentMethod, amount, phone, paymentDate, status)
                OUTPUT INSERTED.id
                VALUES (@orderID, @paymentMethod, @amount, @phone, @paymentDate, @status)
            `);

        const paymentID = result.recordset[0].id;
        // console.log(paymentID);

        const body = {
            orderCode: paymentID,
            amount: amount,
            description: "Thanh toan don hang",
            items: items, // Use the dynamically constructed items array
            cancelUrl: 'http://localhost:3000/cancel.html',
            returnUrl: 'http://localhost:3000/success.html'
        };

        const paymentLinkRes = await payOS.createPaymentLink(body);
        return res.status(201).json({ message: "Payment created successfully", paymentInformation: paymentLinkRes, item : items });
    } catch (error) {
        console.error('Error creating payment', error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        pool.close();
    }
};
const getListPayment = async (req, res, next) => {
    const pool = await connect();

    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 5; // Default to 5 elements per page if not provided
    const offset = (page - 1) * limit;

    try {
        const result = await pool.request()
            .input('limit', limit)
            .input('offset', offset)
            .query(`
                SELECT * FROM Payment
                ORDER BY id
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `);

        const countResult = await pool.request()
            .query('SELECT COUNT(*) AS total FROM Payment');

        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalItems: total,
            listPayments: result.recordset
        });
    } catch (error) {
        console.error('Error getting list of payments:', error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        pool.close();
    }
};

const payPayment = async (req, res, next) => {
    const { paymentMethod } = req.body;
    const paymentID = req.params.paymentID;
    const pool = await connect();

    try {
        // Get payment details to retrieve the orderID and phone
        const paymentResult = await pool.request()
            .input('paymentID', paymentID)
            .query('SELECT * FROM Payment WHERE id = @paymentID');

        if (paymentResult.recordset.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const orderID = paymentResult.recordset[0].orderID;
        const phone = paymentResult.recordset[0].phone;
        const amount = paymentResult.recordset[0].Amount;

        // Update the order's status to "Done"
        const orderUpdateResult = await OrderController.updateOrder({ orderID: orderID, status: "Done", total: 0 });

        if (!orderUpdateResult) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update the status of OrderDetails to "Done"
        await pool.request()
            .input('orderID', orderID)
            .input('status', 'Done')
            .query(`
                UPDATE OrderDetails
                SET status = @status
                WHERE orderID = @orderID
            `);

        // Update the payment details
        const paymentUpdateResult = await pool.request()
            .input('paymentID', paymentID)
            .input('paymentMethod', paymentMethod)
            .input('status', 1) // Setting status to 1
            .query(`
                UPDATE Payment
                SET paymentMethod = @paymentMethod, status = @status
                WHERE id = @paymentID
            `);

        if (paymentUpdateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Payment update failed" });
        }

        // Calculate the points as 10% of the total payment amount
        const points = amount * 0.1;

        // Update the customer's points in the Customer table
        await pool.request()
            .input('phone', phone)
            .input('points', points)
            .query(`
                UPDATE Customers
                SET point = point + @points
                WHERE phone = @phone
            `);

        return res.status(200).json({ message: "Payment and customer points updated successfully" });
    } catch (error) {
        console.error('Error updating payment:', error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        pool.close();
    }
};
const cancelPayment = async (req, res, next) => {
    const paymentID = req.params.paymentID;
    const pool = await connect();

    try {
        // Get payment details to retrieve the orderID and phone
        const paymentResult = await pool.request()
            .input('paymentID', paymentID)
            .query('SELECT * FROM Payment WHERE id = @paymentID');

        if (paymentResult.recordset.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // Update the payment details
        const paymentUpdateResult = await pool.request()
            .input('paymentID', paymentID)
            .input('status', 2) // Assuming 2 indicates 'Cancelled'
            .query(`
                UPDATE Payment
                SET status = @status
                WHERE id = @paymentID
            `);

        if (paymentUpdateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Payment update failed" });
        }

        return res.status(200).json({ message: "Payment cancelled successfully" });
    } catch (error) {
        console.error('Error cancelling payment:', error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        pool.close();
    }
};
module.exports = { createPayment, getListPayment, payPayment ,cancelPayment};
