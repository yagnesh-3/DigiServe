const express = require("express")
const mongoose = require("mongoose");
const Table = require("../models/tableModel");
const Product = require("../models/productModel")
const Order = require("../models/ordersModel")
const orderId = require("../models/orderIdModel")
const router = express.Router();

router.get("/", async (req, res) => {
    res.send("hello order")
})

async function updateOrderId(orderIds) {
    try {
        const parts = orderIds.split("-");
        const date = parts[0]
        let count = parseInt(parts[1]);
        let order = await orderId.findOne({ date: date });
        if (!order) {
            const neworderId = new orderId({
                date,
                count
            })
            neworderId.save();
        } else {
            count = order.count + 1; // Increment count
            await orderId.findOneAndUpdate(
                { date: date },
                { count: count },
                { new: true } // Ensures the updated document is returned
            );
        }
    } catch (error) {
        console.log(error);

    }
}

async function getTableId(tableSel) {
    const data = await Table.findOne({ tableName: tableSel });
    return data._id;
}

router.post("/place-order", async (req, res) => {
    try {
        const { tableSel, orderId, } = req.body;
        const user = req.user;
        const table = await Table.findOne({ tableName: tableSel }).populate("cart.product");
        if (!table) {
            return res.status(404).json({ error: "Table not found" });
        }

        const subTotal = table.cartTotal;
        const gst = Number((table.cartTotal * 0.10).toFixed(2));
        const total = subTotal + gst;

        const tableId = await getTableId(tableSel);

        const order = new Order({
            orderId,
            table: tableId,
            waiter: user.id,
            items: table.cart,
            totalPrice: total
        })

        const resp = await order.save()
        await updateOrderId(orderId)
        table.isOccupied = true
        table.cart = []
        table.cartTotal = 0
        table.currentOrder = resp._id
        await table.save()
        console.log("ca", resp, "ce")

        const io = req.app.get("socketio");
        io.to("admin").emit("orderPlaced", {
            resp
        });

        res.json({ status: true, id: resp._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/orders", async (req, res) => {
    try {
        const user = req.user;
        const orders = await Order.find({ waiter: user.id })
            .populate("items.product")
            .populate("table");

        // Define custom status order
        const statusOrder = ["served", "pending", "preparing", "ready", "paid"];

        // Sort the orders in JS based on status
        orders.sort((a, b) => {
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get("/orderId", async (req, res) => {
    try {
        const todayDate = new Date().toISOString().split("T")[0].replace(/-/g, "");
        let order = await orderId.findOne({ date: todayDate });
        let date;
        let count;
        if (!order) {
            date = todayDate;
            count = 1;
        } else {
            date = order.date
            count = order.count += 1;
        }
        res.json(`${date}-${count}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post("/handlePayment", async (req, res) => {
    try {
        const id = req.body.id;
        const order = await Order.findById(id).populate('table');

        if (order && order.table) {
            order.table.isOccupied = false;
            await order.table.save(); // Save the updated table
        }
        order.status = "paid"
        await order.save();
        res.status(200).json({ status: true, message: "payment sucessful" })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



module.exports = router