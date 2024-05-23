const sql = require('mssql');
const { promisify } = require('util');
const config = require('./config.js');

const connect = async () => {
    const connectionPool = new sql.ConnectionPool(config);
    const connectAsync = promisify(connectionPool.connect).bind(connectionPool);


    try {
        await connectAsync();
        // console.log('Connected to SQL Server successfully');
        return connectionPool;
    } catch (error) {
        console.error('Error connecting to SQL Server:', error.message);
        throw error;
    }

};

module.exports = connect



