const connect = require('../database/connect');
const TableController = require('./TableController');

const initOrder = async (req, res, next) => {
    const { tablenumber, mode, numberguest } = req.body;
    const orderdate = new Date(); // Get the current date and time
    const pool = await connect();

    try {
        const table = await TableController.findTableByTableNumber(tablenumber);
        if (table == null) {
            return res.status(404).json({ message: "Table not found" });
        }
        // console.log(table.status === 1)
        // status == 1 is free
        // status == 0 is busy
        if (table.status === '1') {
            await TableController.updateTableByTableNumber(tablenumber, 0);
        } else return res.status(400).json({ message: "Table is busy" });

        const result = await pool.request()
            .input('tablenumber', tablenumber)
            .input('mode', mode)
            .input('numberguest', numberguest)
            .input('orderdate', orderdate)
            .input('status', "In Service")
            .input('Total', 0)
            .query(`
                INSERT INTO Orders (tablenumber, mode, numberguest, orderdate, status, Total)
                VALUES (@tablenumber, @mode, @numberguest, @orderdate, @status, @Total)
            `);

        return res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
        // console.error('Error inserting new order', error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        pool.close();
    }
};

const updateMode = async (req, res, next) => {
    const { mode } = req.body;
    const orderID = req.params.orderID;
    const pool = await connect();
    try {
        // Ensure the order exists before attempting to update it
        const orderResult = await pool.request()
            .input('orderID', orderID)
            .query('SELECT * FROM Orders WHERE id = @orderID');

        if (orderResult.recordset.length === 0) {
            return res.status(404).json({ message: 'The order is not found' })
        }
        // Update the order with the new values
        await pool.request()
            .input('orderID', orderID)
            .input('mode', mode)
            .query(`
                UPDATE Orders
                SET mode = @mode
                WHERE id = @orderID
            `);
        return res.status(200).json({ message: "Change mode successfully" })
        // console.log('Order updated successfully');
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        pool.close();
    }
};
const updateOrder = async ({ orderID, mode, status, total }) => {
    const pool = await connect();
    try {
        // Ensure the order exists before attempting to update it
        const orderResult = await pool.request()
            .input('orderID', orderID)
            .query('SELECT * FROM Orders WHERE id = @orderID');

        if (orderResult.recordset.length === 0) {
            throw new Error('Order not found');
        }

        const existingOrder = orderResult.recordset[0];

        // Use existing values if mode or status are not provided
        const newMode = mode == 'undefined' ? mode : existingOrder.mode;
        const newTotal = existingOrder.Total + total;

        // Update the order with the new values
        await pool.request()
            .input('orderID', orderID)
            .input('mode', newMode)
            .input('status', status)
            .input('total', newTotal)
            .query(`
                UPDATE Orders
                SET mode = @mode, status = @status, Total = @total
                WHERE id = @orderID
            `);
        return 1;
        // console.log('Order updated successfully');
    } catch (error) {
        console.error('Error updating order', error);
        throw error;
    } finally {
        pool.close();
    }
};
const getOrderById = async (req, res, next) => {
    const orderID = req.params.orderID;
    try {
        const order = await findOrderById(orderID)
        if (order == null) return res.status(404).json({ message: "The order is not found" });
        return res.status(200).json({ order: order });
    } catch (error) {
        // console.error('Error inserting new order', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const findOrderById = async (id) => {
    const pool = await connect();
    try {
        const result = await pool.request()
            .query(`
                SELECT O.*, OD.productID, OD.quantity, OD.status AS detailStatus, OD.orderTime AS detailOrderTime,
                       P.name as productName, P.price, P.image AS productImage
                FROM Orders O
                LEFT JOIN OrderDetails OD ON O.id = OD.orderID
                LEFT JOIN Products P ON OD.productID = P.id
                WHERE O.id = ${id}
            `);

        if (result.recordset.length === 0) {
            return null; // Return null if no order found
        }

        const order = {
            id: result.recordset[0].id,
            numberguest: result.recordset[0].numberguest,
            mode: result.recordset[0].mode,
            orderdate: result.recordset[0].orderdate,
            status: result.recordset[0].status,
            Total: result.recordset[0].Total,
            orderDetails: [] // Initialize array for order details
        };

        // Iterate over the result set to construct orderDetails array
        result.recordset.forEach(row => {
            if (row.productID !== null) { // Check if order detail exists
                // Push order detail to orderDetails array
                order.orderDetails.push({
                    productID: row.productID,
                    productName: row.productName,
                    price: row.price,
                    image: row.productImage,
                    quantity: row.quantity,
                    status: row.detailStatus,
                    orderTime: row.detailOrderTime
                });
            }
        });

        return order;
    } catch (error) {
        console.error('Error finding order by ID:', error);
        return null;
    } finally {
        pool.close();
    }
};
const getListOrder = async (req, res, next) => {
    const pool = await connect();

    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 5; // Default to 5 elements per page if not provided
    const offset = (page - 1) * limit;

    try {
        // Step 1: Fetch the paginated orders
        const ordersResult = await pool.request()
            .input('limit', limit)
            .input('offset', offset)
            .query(`
                SELECT * FROM Orders
                ORDER BY id
                OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
            `);

        if (ordersResult.recordset.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        const orderIds = ordersResult.recordset.map(order => order.id);

        // Step 2: Fetch order details for the paginated orders
        const orderDetailsResult = await pool.request()
            .query(`
                SELECT OD.*, P.name as productName, P.price, P.image AS productImage
                FROM OrderDetails OD
                LEFT JOIN Products P ON OD.productID = P.id
                WHERE OD.orderID IN (${orderIds.join(',')})
            `);

        const orderDetailsMap = {};
        orderDetailsResult.recordset.forEach(detail => {
            if (!orderDetailsMap[detail.orderID]) {
                orderDetailsMap[detail.orderID] = [];
            }
            orderDetailsMap[detail.orderID].push({
                productID: detail.productID,
                productName: detail.productName,
                price: detail.price,
                image: detail.productImage,
                quantity: detail.quantity,
                status: detail.status,
                orderTime: detail.orderTime
            });
        });

        // Combine orders with their details
        const orders = ordersResult.recordset.map(order => ({
            idOrder: order.id,
            numberguest: order.numberguest,
            mode: order.mode,
            orderdate: order.orderdate,
            status: order.status,
            Total: order.Total,
            orderDetails: orderDetailsMap[order.id] || []
        }));

        // Fetch total count of orders for pagination
        const countResult = await pool.request()
            .query('SELECT COUNT(*) AS total FROM Orders');

        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalItems: total,
            listOrders: orders
        });
    } catch (error) {
        console.error('Error getting list of orders:', error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        pool.close();
    }
};
module.exports = { initOrder, updateOrder, updateMode, findOrderById, getOrderById, getListOrder };