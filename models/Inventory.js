const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    product:{
        type: String
    },
    description:{
        type: String
    },
    quantity:{
        type: Number
    },
    buyingPrice:{
        type: Number
    }
});

const Inventory = mongoose.model('inventories', InventorySchema);

module.exports = Inventory;