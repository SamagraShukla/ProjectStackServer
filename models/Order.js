const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const OrderSchema = new mongoose.Schema(
    {
        email:  {type: String},
        phone: String,
        order_items: Array,
        Total:   Number,
        special_instructions: String,
        status: String,
        date: {type: Date,default: Date.now}
    }
);

const Order = mongoose.model('order',OrderSchema);
module.exports = Order;