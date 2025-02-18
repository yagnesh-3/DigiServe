const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
    tableName: { type: String, required: true, unique: true },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Active order for the table
    isOccupied: { type: Boolean, default: false },
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product
        quantity: { type: Number, default: 1 }, // Quantity of the product
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Table", TableSchema);
