const connect = require('../database/connect');
const ProductController = require('./ProductController')
const OrderController = require('./OrderController')

const createOrderDetail = async (req, res, next) => {
    const { productID, quantity } = req.body;
    const orderID = req.params.orderID;
    const orderTime = new Date(); // Get the current date and time
    const pool = await connect();

    try {
        const product = await ProductController.findProductById(productID);
        // console.log(product);
        if (product.isBuffet) {
            // Find the order by ID
            const order = await OrderController.findOrderById(orderID);
            // console.log(order);
            // Check if the order already has a buffet ticket
            const existingBuffetTicket = order.orderDetails.find(detail => detail.productID === productID);

            if (existingBuffetTicket) {
                // If a buffet ticket already exists in the order, do not reorder
                return res.status(400).json({ message: "Buffet ticket already exists in the order" });
            }

            // If the order does not have a buffet ticket, proceed to create a new one
            const guest = order.numberguest;
            await pool.request()
                .input('orderID', orderID)
                .input('productID', productID)
                .input('quantity', guest)
                .input('status', 'In Service')
                .input('orderTime', orderTime)
                .query(`
                    INSERT INTO OrderDetails (orderID, productID, quantity, status, orderTime)
                    VALUES (@orderID, @productID, @quantity, @status, @orderTime)
                `);

            await OrderController.updateOrder({ orderID: orderID, status: "In Service", total: product.price * guest });

            return res.status(201).json({ message: "Buying buffet ticket successfully" });
        }
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const price = product.price;
        const total = price * quantity;

        // status == 1 is available
        if (product.status == 1) {
            const orderDetailResult = await pool.request()
                .input('orderID', orderID)
                .input('productID', productID)
                .query(`
                    SELECT * FROM OrderDetails
                    WHERE orderID = @orderID AND productID = @productID
                `);

            if (orderDetailResult.recordset.length > 0) {
                // Order detail exists, update quantity and total
                const existingOrderDetail = orderDetailResult.recordset[0];
                const newQuantity = existingOrderDetail.quantity + quantity;
                const newTotal = price * newQuantity;

                await pool.request()
                    .input('orderID', orderID)
                    .input('productID', productID)
                    .input('quantity', newQuantity)
                    .query(`
                        UPDATE OrderDetails
                        SET quantity = @quantity
                        WHERE orderID = @orderID AND productID = @productID
                    `);

                await OrderController.updateOrder({ orderID: orderID, status: "In Service", total: newTotal });

                return res.status(200).json({ message: "Order detail updated successfully" });
            } else {
                // Order detail does not exist, create new entry
                await pool.request()
                    .input('orderID', orderID)
                    .input('productID', productID)
                    .input('quantity', quantity)
                    .input('status', 'Preparing')
                    .input('orderTime', orderTime)
                    .query(`
                        INSERT INTO OrderDetails (orderID, productID, quantity, status, orderTime)
                        VALUES (@orderID, @productID, @quantity, @status, @orderTime)
                    `);

                await OrderController.updateOrder({ orderID: orderID, status: "In Service", total: total });

                return res.status(201).json({ message: "Order detail created successfully" });
            }
        } else {
            return res.status(400).json({ message: "Product is sold out" });
        }
    } catch (error) {
        console.error('Error inserting new order detail', error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        pool.close();
    }
};


module.exports = { createOrderDetail };