const express = require('express');
const inventoryRouter = require('./routes/api/inventories');
const queryRouter = require('./routes/api/technicalqueries');
const tableBookingRouter = require('./routes/api/tablebooking');
const connectDB = require('./config/connectDB');
const cors = require("cors");

const app = express();
app.use(cors());
//connect to db
connectDB();

//set a middleware to parse data
app.use(express.json());

app.use('/api/inventories', inventoryRouter);
app.use('/api/technicalqueries', queryRouter);
app.use('/api/tablebookings', tableBookingRouter);

app.listen(5000);


