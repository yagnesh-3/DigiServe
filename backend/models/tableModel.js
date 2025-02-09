const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true, unique: true },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Active order for the table
    isOccupied: { type: Boolean, default: false }, // Indicates if the table is in use
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Table", TableSchema);
