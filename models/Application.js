const mongoose = require('mongoose');
var mongooseTypePhone = require('mongoose-type-phone');     // npm install mongoose-type-phone

const appSchema = new mongoose.Schema(
  {firstname: { type: String, require: true},
  lastname: { type: String, require: true},
  phone: {type: String},    //{type: mongoose.SchemaTypes.Phone, required: true},
  email: {type: String, lowercase: true, required: [true, "can't be blank"]},  //, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  position: { type: String, require: true },
  resume: { type: String }
  });


  var application = mongoose.model('application', appSchema);

module.exports = application;


//phone: {type: mongoose.SchemaTypes.Phone, required: true},