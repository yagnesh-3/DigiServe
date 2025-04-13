const express = require("express")
const mongoose = require("mongoose");
const Table = require("../models/tableModel");
const Product = require("../models/productModel")
const orderId = require("../models/orderIdModel")
const Order = require("../models/ordersModel")
const User = require("../models/usersModel");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("hwllo admin Dash");
})

router.get("/getData", async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(user);
        let search = {};
        if (user.role === "waiter") {
            search = { waiter: user._id };
        }
        const todayDate = new Date().toISOString().split("T")[0].replace(/-/g, "");
        search.orderId = { $regex: `^${todayDate}-` };
        const orders = await Order.find(search);
        const totalOrders = orders.length;
        // const count = await Table.countDocuments({ isOccupied: true }) || 0;

        search.status = { $eq: "served" };
        const pendingOrders = await Order.countDocuments(search);
        search.status = { $ne: "paid" };
        delete search.orderId;
        const activeOrders = await Order.find(search).populate("items.product").populate("table");
        const count = activeOrders.length;
        const simplifiedOrders = activeOrders.map(order => ({
            tableNumber: order.table.tableName, // assuming order.table is populated or has this field
            orderId: order.orderId,
            items: order.items.map(item => item.product.name),
            status: order.status // e.g. "pending" => "Pending"
        }));

        // const revenueToday = revenueResult[0]?.totalIncome || 0;
        const totalRevenue = orders
            .filter(order => order.status === 'paid')
            .reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2);
        return res.status(200).json({ "totalOrders": totalOrders, "activeTables": count, pendingOrders, "revenueToday": totalRevenue, simplifiedOrders })
    } catch (error) {
        console.log(error)
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
        const io = req.app.get("socketio");
        const waiterId = order.waiter?._id?.toString();
        if (waiterId) {
            io.to(waiterId).emit("orderStatusUpdated", {
                orderId: order.orderId,
                status: nextStatus,
            });
        }
        io.to("admin").emit("orderStatusUpdated", {
            orderId: order.orderId,
            status: nextStatus,
        });
        return res.status(200).json({ message: "Order status updated successfully" })
    } catch (error) {
        console.log("error:", error)
        return res.status(500).json({ error: error.message })
    }
})

module.exports = router