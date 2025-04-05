const mongoose = require("mongoose");

const IdSchema = new mongoose.Schema({
    date: String,
    count: Number,
});

module.exports = mongoose.model("counters", IdSchema);