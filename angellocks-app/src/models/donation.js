let mongoose = require("mongoose");

let donationSchema = new mongoose.Schema({

    donation_id: Number,
    donor_id: String,
    org_id: String,
    status: String,
    type:String,
    length:String,
    texture:String,
    timestamp: {
        type: Date,
        default: Date.now()
    }

});


module.exports = mongoose.model("Donations", donationSchema, "donations");





