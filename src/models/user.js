let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    name: String,
    // lastName: String,
    gender: String,
    email: String,
    dob: String,
    contactNo: Number,
    accountAddress: String,
    status: String,
    gray: Boolean,
    colored: Boolean,
    length: String,
    texture:String

});


module.exports = mongoose.model("Users",userSchema,"users");





