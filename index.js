const express = require('express');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');
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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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


app.post('/email', function (req, res) {
   
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'hellotesterphp26@gmail.com',
            pass: 'onetwo12@'
        }
    });
    let mailOptions = {
        from: '"Customer Support" hellotesterphp26@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Restautant Customer Support',
        html: '<h4>Thank you for contacting us. Out team will contact you soon.</h4>'
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent sucessfully ', info.messageId, info.response);
            res.render('index');
    });
});

app.listen(process.env.PORT || 5001);


