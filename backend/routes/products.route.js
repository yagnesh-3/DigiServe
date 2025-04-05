const express = require("express")
const mongoose = require("mongoose");
const Table = require("../models/tableModel");
const Product = require("../models/productModel")
const router = express.Router();


router.get("/", (req, res) => {
    res.send("hello product")
})

router.post("/add-product", async (req, res) => {
    console.log("called")
    const { name, imageUrl, ingredients, price } = req.body.item
    console.log("rb", name, "rb");
    const product = new Product({ name, imageUrl, ingredients, price })
    const result = await product.save()
    if (result) {
        res.status(201).json({ message: "Product added successfully" })
    } else {
        res.status(400).json({ message: "Failed to add product" })
    }
})

router.get("/get-products", async (req, res) => {
    const products = await Product.find()
    res.json(products)
})

router.post("/add-products", async (req, res) => {
    try {
        const products = req.body; // Expecting an array of products
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid input. Expected an array of products." });
        }

        const result = await Product.insertMany(products);
        res.status(201).json({ message: "Products added successfully", data: result });
    } catch (error) {
        res.status(500).json({ message: "Failed to add products", error: error.message });
    }
});

router.delete("/delete-product/:id", async (req, res) => {
    const id = req.params.id;

    try {
        // Remove the product from all tables' carts
        await Table.updateMany({}, { $pull: { cart: { product: id } } });

        // Delete the product from the database
        const result = await Product.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: "Product deleted successfully and removed from all carts" });
        } else {
            res.status(400).json({ message: "Failed to delete product" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.put("/edit", async (req, res) => {
    try {
        const { id, name, imageUrl, ingredients, price } = req.body.item;

        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, imageUrl, ingredients, price },
            { new: true } // Returns the updated document
        );

        if (updatedProduct) {
            res.status(200).json({ message: "Product updated successfully", updatedProduct });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
});


module.exports = router