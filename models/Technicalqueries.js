const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    query:{
        type: String
    }
});

const TechnicalQuery = mongoose.model('technicalqueries', QuerySchema);

module.exports = TechnicalQuery;