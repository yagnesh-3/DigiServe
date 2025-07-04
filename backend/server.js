const express = require("express")
const http = require("http");  // Import HTTP module
const { Server } = require("socket.io");
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const Product = require("./models/productModel")
const cookieParse = require("cookie-parser")
const Table = require("./models/tableModel.js")
const authRouter = require("./routes/auth.route.js")
const auth = require("./middlewares/auth.js");
const Cartrouter = require("./routes/cart.route.js")
const adminDashRouter = require("./routes/adminDash.route.js")
const waiterDashRouter = require("./routes/waiterDash.route.js")
const tableRouter = require("./routes/table.route.js")
const productRouter = require("./routes/products.route.js")
const orderRouter = require("./routes/order.route.js")
const uploadRouter = require("./routes/upload.route.js");
const server = http.createServer(app);
app.use(cors())
app.use(cookieParse())
app.use(express.json())

const io = new Server(server, {
    cors: {
        origin: "*", // Replace with actual frontend URL
        methods: ["GET", "POST"]
    }
});
app.set("socketio", io);
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // ✅ Join room using userId (waiterId)
    socket.on("joinRoom", (userIdOrRole) => {
        console.log(`User ${userIdOrRole} joined room`);
        socket.join(userIdOrRole); // supports "admin" or waiterId
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

app.use("/auth", authRouter)
app.use(auth);
app.use("/cart", Cartrouter)
app.use("/table", tableRouter)
app.use("/product", productRouter)
app.use("/order", orderRouter)
app.use("/files", uploadRouter);
app.use("/adminDash", adminDashRouter)
app.use("/waiterDash", waiterDashRouter)
server.listen(5000, '0.0.0.0', () => {
    console.log("server is running on port 5000")
})
mongoose.connect("mongodb://127.0.0.1:27017/Digiserve").then(() => {
    console.log("Connected to MongoDB")
})
app.get("/", (req, res) => {
    res.send("Welcome to Digiserve backend")
})

app.get("/orderId", async (req, res) => {

    return res.json({ date: "120212", count: 1 });
})


