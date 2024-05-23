const connect = require('../database/connect');

const findTableByTableNumber = async (tablenumber) => {
    const pool = await connect();
    try {
        const table = await pool.request()
            .query(`SELECT * FROM "Tables" WHERE tablenumber = ${tablenumber}`)
            // console.log(table.recordset[0].status)
        return table.recordset[0];
    } catch (error) {
        return null;
    }
    finally {
        pool.close();
    }
}
const updateTableByTableNumber = async (tablenumber, status) => {
    const pool = await connect();
    try {
        const result = await pool.request()
            .query(`UPDATE "Tables" SET status = ${status} WHERE tablenumber = ${tablenumber}`);
        return 1;
    } catch (error) {
        return null;
    } finally {
        pool.close();
    }
};
module.exports = { findTableByTableNumber,updateTableByTableNumber }