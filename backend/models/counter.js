import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
