// import library
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connect = require('./database/connect')
// import route
const OrderRoute = require('./routes/OrderRoute');
const OrderDetailRoute = require('./routes/OrderDetailRoute');
const PaymentRoute = require('./routes/PaymentRoute');
// using library
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// use route
app.use('/api',OrderRoute)
app.use('/api',OrderDetailRoute)
app.use('/api',PaymentRoute)
// init port 
const port = 5001;


// test connect
app.listen(port, async () => {
    connect();
    console.log("Server OK")
})