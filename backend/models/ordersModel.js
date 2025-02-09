const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true },
    waiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
    }],
    status: { 
        type: String, 
        enum: ["pending", "preparing", "ready", "served", "paid"], 
        default: "pending" 
    },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
