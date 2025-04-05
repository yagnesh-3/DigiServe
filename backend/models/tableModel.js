const mongoose = require("mongoose")
const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 }
}, { _id: false }); // Prevent _id generation for cart items

const TableSchema = new mongoose.Schema({
    tableName: { type: String, required: true, unique: true },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    isOccupied: { type: Boolean, default: false },
    cart: [CartItemSchema],
    cartTotal: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Table", TableSchema);
