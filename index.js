const express = require('express');

const userRoute = require('./routes/api/user');
const itemRoute = require('./routes/api/items');
const orderRoute = require('./routes/api/orders');
const locationRoute = require('./routes/api/location.js');
const couponRoute = require('./routes/api/coupons');
const applicationRoute = require('./routes/api/application');



const inventoryRouter = require('./routes/api/inventories');
const queryRouter = require('./routes/api/technicalqueries');
const tableBookingRouter = require('./routes/api/tablebooking');


//const userRoute = require('./routes/api/users');
const connectDB = require('./config/connectDB');
const cors = require('cors');

const app = express();
app.use(cors());

connectDB();

//set a middleware to parse data
app.use(express.json()); 

app.use('/api/location', locationRoute);
app.use('/api/user', userRoute);
app.use('/api/items', itemRoute);

app.use('/api/orders', orderRoute);
app.use('/api/inventories', inventoryRouter);
app.use('/api/technicalqueries', queryRouter);
app.use('/api/tablebookings', tableBookingRouter);

app.use('/api/user', userRoute);
app.use('/api/coupons', couponRoute);
app.use('/api/application', applicationRoute);

app.listen(process.env.PORT);


