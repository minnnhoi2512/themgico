const connect = require('../database/connect');

const findProductById = async (id) => {
    const pool = await connect();
    try {
        const result = await pool.request()
            .query(`
            SELECT P.*, C.name as categoryName
            FROM Products P
            INNER JOIN Categories C ON P.categoryID = C.categoryID
            WHERE P.id = ${id}
            `);

        const product = result.recordset[0];

        if (product && product.categoryName && product.categoryName.toLowerCase().includes('buffet')) {
            // If the categoryName contains 'buffet' (case-insensitive), add a property to indicate it
            product.isBuffet = true;
        } else {
            product.isBuffet = false;
        }

        return product;
    } catch (error) {
        console.error('Error finding product by ID:', error);
        return null;
    } finally {
        pool.close();
    }
};
module.exports = { findProductById }