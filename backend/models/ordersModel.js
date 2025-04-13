const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true }
}, { _id: false }); // Disable _id for order items

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    waiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema], // Use the sub-schema
    status: {
        type: String,
        enum: ["pending", "preparing", "ready", "served", "paid"],
        default: "pending"
    },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
