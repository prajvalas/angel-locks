let mongoose = require("mongoose");

let orgSchema = new mongoose.Schema({
    name: String,
    email: String,
    contactNo: String,
    address: String,
    accountAddress: String,

});


module.exports = mongoose.model("Orgs",orgSchema,"orgs");





