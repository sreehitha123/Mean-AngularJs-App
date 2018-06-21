
var mongoose = require('mongoose');

var Posts = new mongoose.Schema({
 
    title: String,
description: String,
keyword:  String,
location: String,

});

module.exports = mongoose.model("Posts", Posts);


