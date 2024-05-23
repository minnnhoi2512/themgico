const connect = require('../database/connect');

const findCustomerByPhone = async (phone) => {
    const pool = await connect();

    try {
        const result = await pool.request()
            .input('phone', phone)
            .query(`
                SELECT * FROM Customers
                WHERE phone = @phone
            `);

        // Return the first matching customer record, if any
        return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
        console.error('Error finding customer by phone:', error);
        return null;
    } finally {
        pool.close();
    }
};
const createCustomer = async (name, phone) => {
    const pool = await connect();

    try {
        const result = await pool.request()
            .input('name', name)
            .input('phone', phone)
            .input('point', 0) // Assuming initial points are 0
            .query(`
                INSERT INTO Customers (name, phone, point)
                VALUES (@name, @phone, @point)
            `);


        return result; // You can return the result if needed
    } catch (error) {
        throw error; // Throw the error to be caught by the caller
    } finally {
        pool.close();
    }
};
module.exports = { findCustomerByPhone, createCustomer };