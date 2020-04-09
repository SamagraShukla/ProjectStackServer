const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ItemSchema = new mongoose.Schema(
    {
        name:  {type: String}, 
        unit_price: Number,
        category:   String,
        description: String
    }
);

const Item = mongoose.model('item',ItemSchema);
module.exports = Item;