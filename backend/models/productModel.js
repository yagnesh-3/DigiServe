const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    ingredients: { type: [String], required: true },
    status: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
