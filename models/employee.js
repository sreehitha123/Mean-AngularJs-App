
var mongoose = require('mongoose');

var Employee = new mongoose.Schema({
name: String,password: String,email: String,location: String, phone: Number,
    selecteduser: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Employee", Employee);

