const express = require("express")
const mongoose = require("mongoose");
const Table = require("../models/tableModel");
const Product = require("../models/productModel")
const router = express.Router();


router.get("/", (req, res) => {
    res.send("hello table")
})

router.post("/add-table", async (req, res) => {
    console.log("called")
    try {
        const tableName = req.body.tableName;
        console.log(tableName)
        const table = new Table({ tableName });
        const result = await table.save();
        console.log("res", result)
        if (result) {
            res.status(201).json({ message: "Table added successfully" });
        } else {
            res.status(400).json({ error: "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/get-tables", async (req, res) => {
    const data = await Table.find({})
    res.status(200).json({ data })
})
router.post("/get-table", async (req, res) => {
    const { tableSel } = req.body;
    const data = await Table.findOne({ tableName: tableSel })

    console.log(data, "tm")
    res.status(200).json({ data })
})



module.exports = router