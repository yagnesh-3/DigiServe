const express = require("express")
const mongoose = require("mongoose");
const Table = require("../models/tableModel");
const Product = require("../models/productModel")
const orderId = require("../models/orderIdModel")
const Order = require("../models/ordersModel")
const router = express.Router();

// router.get("/", (req, res) => {
//     const userId = req.query.userId.

// })

router.get("/getData", async (req, res) => {
    try {
        const todayDate = new Date().toISOString().split("T")[0].replace(/-/g, "");
        let order = await orderId.findOne({ date: todayDate }) || { count: 0 };
        const count = await Table.countDocuments({ isOccupied: true }) || 0;
        const pendingOrders = await Order.countDocuments({ status: { $eq: "served" } });
        const paidOrders = await Order.countDocuments({
            status: "paid",
            orderId: { $regex: `^${todayDate}-` } // starts with today's date
        });

        const activeOrders = await Order.find({ status: { $ne: "paid" } }).populate("items.product").populate("table");

        const simplifiedOrders = activeOrders.map(order => ({
            tableNumber: order.table.tableName, // assuming order.table is populated or has this field
            orderId: order.orderId,
            items: order.items.map(item => item.product.name),
            status: order.status // e.g. "pending" => "Pending"
        }));



        const revenueResult = await Order.aggregate([
            {
                $match: {
                    status: "paid",
                    orderId: { $regex: `^${todayDate}-` }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$totalPrice" }
                }
            }
        ]);
        const revenueToday = revenueResult[0]?.totalIncome || 0;
        return res.status(200).json({ "totalOrders": order.count, "activeTables": count, pendingOrders, paidOrders, revenueToday, simplifiedOrders })
    } catch (error) {
        return res.status(500).json({ error: error.message, hi: "hi" })
    }
})

router.patch("/updateStatus", async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const nextStatus = req.body.nextStatus;
        let order = await Order.findOne({ orderId: orderId }).populate('table');
        if (nextStatus == "paid") {
            order.table.isOccupied = false;
            await order.table.save();
        }
        order.status = nextStatus;
        order.save();
        return res.status(200).json({ message: "Order status updated successfully" })
    } catch (error) {
        console.log("error:", error)
        return res.status(500).json({ error: error.message })
    }
})

module.exports = router