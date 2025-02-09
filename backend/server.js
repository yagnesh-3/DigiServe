const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const Product = require("./models/productModel")
app.use(cors())
app.use(express.json())
app.listen(5000, () => {
    console.log("server is running on port 5000")
})
mongoose.connect("mongodb://127.0.0.1:27017/Digiserve").then(() => {
    console.log("Connected to MongoDB")
})

app.post("/add-product", async (req, res) => {
    const { name, imageUrl, ingredients, price } = req.body
    const product = new Product({ name, imageUrl, ingredients, price })
    const result = await product.save()
    if (result) {
        res.status(201).json({ message: "Product added successfully" })
    } else {
        res.status(400).json({ message: "Failed to add product" })
    }
})

app.get("/get-products", async (req, res) => {
    const products = await Product.find()
    res.json(products)
})

app.post("/add-products", async (req, res) => {
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

app.delete("/delete/:id",async(req,res)=>{
    const id=req.params.id;
    const result=await Product.findByIdAndDelete(id);
    if(result){
        res.status(200).json({message:"Product deleted successfully"})
    }
    else{
        res.status(400).json({message:"Failed to delete product"})
    }
})