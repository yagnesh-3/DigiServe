
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const Product = require("./models/productModel")
const Table = require("./models/tableModel.js")
const Cartrouter = require("./routes/cart.route.js")
const tableRouter = require("./routes/table.route.js")
const productRouter = require("./routes/products.route.js")
app.use(cors())
app.use(express.json())
app.use("/cart", Cartrouter)
app.use("/table", tableRouter)
app.use("/product", productRouter)
app.listen(5000, () => {
    console.log("server is running on port 5000")
})
mongoose.connect("mongodb://127.0.0.1:27017/Digiserve").then(() => {
    console.log("Connected to MongoDB")
})









