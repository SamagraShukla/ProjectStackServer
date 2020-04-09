const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new mongoose.Schema({
    location :{
        type: String 
    },
    franchise_name:{
        type: String
    },
    latitude:{
        type: String
    },
    longitude:{
        type: String
    },
    address:{
        type: String
    }
});

const Location = mongoose.model('location', LocationSchema);
module.exports = Location;