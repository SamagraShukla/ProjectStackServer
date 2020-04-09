const mongoose = require('mongoose');

const TableBookingSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    noOfPerson:{
        type: Number
    },
    specialInstruction:{
        type: String
    }
});

const TableBooking = mongoose.model('tablebookings', TableBookingSchema);

module.exports = TableBooking;