const express = require("express")
const mongoose = require("mongoose");
const Table = require("../models/tableModel");
const Product = require("../models/productModel")
const router = express.Router();


router.get("/", (req, res) => {
    res.send("hello cart")
})

router.put("/updateQuantity", async (req, res) => {
    console.log(req.body)
    const { tableSel, id, quantity } = req.body;
    const table = await Table.findOne({ "tableName": tableSel });
    console.log(table)
    const cart = table.cart.find(cartItem => cartItem.product.toString() === id)
    cart.quantity += quantity;
    await table.save()
    res.send(cart)
})

router.put("/removeItem", async (req, res) => {
    const { tableSel, id } = req.body;
    const table = await Table.findOne({ "tableName": tableSel });
    table.cart = table.cart.filter(cartItem => cartItem.product.toString() !== id);
    await table.save();
    res.send(table.cart)
})

router.put("/addItem", async (req, res) => {
    const { tableSel, item } = req.body;
    try {
        const table = await Table.findOne({ tableName: tableSel });
        if (!table) {
            return res.status(404).json({ error: "table not found" })
        }
        console.log(item)
        console.log("tbs", table, "tbe")

        const existingItem = table.cart.find(cartItem => cartItem.product.toString() === item._id);
        console.log("eis", existingItem, "eie")
        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity
        } else {
            table.cart.push({ product: item._id });
        }
        await table.save();
        console.log("done")
        return res.status(201).json({ message: "item added Sucessfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})



router.post("/getCart", async (req, res) => {
    try {
        const { tableSel } = req.body;
        const table = await Table.findOne({ tableName: tableSel });

        if (!table) {
            return res.status(404).json({ error: "Table not found" });
        }

        // Map over cart and fetch products in parallel using Promise.all()
        const cart = await Promise.all(
            table.cart.map(async (item) => {
                const product = await Product.findById(item.product.toString());

                return {
                    _id: product._id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    price: product.price,
                    quantity: item.quantity
                };
            })
        );

        console.log(cart);
        return res.status(200).json({ cart });

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router