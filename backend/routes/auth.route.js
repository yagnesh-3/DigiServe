const express = require("express")
const mongoose = require("mongoose");
const Table = require("../models/tableModel");
const Product = require("../models/productModel");
const User = require("../models/usersModel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { route } = require("./order.route");
const auth = require("../middlewares/auth");
const router = express.Router();


router.get("/", (req, res) => {
    res.send("hello auth")
})

router.post("/authenticate", auth, (req, res) => {
    res.status(200).json({ status: true, message: "auth sucesss" });
})

router.post("/signup", async (req, res) => {
    try {
        const { name, role, email, password } = req.body;
        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(400).json({ message: "email already exists" })
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            role,
            email,
            password: hashedPass
        })
        await newUser.save();
        return res.status(201).json({ status: true, message: "User Registered Sucessfully" })
    } catch (error) {
        return res.status(500).json({ error })
    }
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ status: false, message: "user not found" })
    }
    const passwordCheck = await bcrypt.compare(password, user.password)
    if (!passwordCheck) {
        return res.status(401).json({ status: false, message: "Invalid password" })
    }
    const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "4h" })
    res.cookie("token", token);

    return res.status(200).json({ status: true, message: "Login Sucess", "token": token, user })
})
module.exports = router