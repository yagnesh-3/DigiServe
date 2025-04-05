const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");

const router = express.Router();
const conn = mongoose.connection;

let gridFSBucket;

conn.once("open", () => {
    gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

// ✅ Multer Storage - Store Buffer Instead of GridFS Directly
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload Image Route (Fix: Store as Buffer)
router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const filename = `${Date.now()}-${req.file.originalname}`;
        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        const uploadStream = gridFSBucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
        });

        readableStream.pipe(uploadStream);

        uploadStream.on("finish", () => {
            res.json({ file: { filename }, message: "Image uploaded successfully!" });
        });

        uploadStream.on("error", (err) => {
            res.status(500).json({ error: "Upload failed", details: err.message });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ Fetch Image by Filename
router.get("/image/:filename", async (req, res) => {
    try {
        const file = await gridFSBucket.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) return res.status(404).json({ error: "Image not found" });

        const readStream = gridFSBucket.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving image", details: error.message });
    }
});

// ✅ Delete Image
router.delete("/image/:filename", async (req, res) => {
    try {
        const file = await gridFSBucket.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) return res.status(404).json({ error: "Image not found" });

        await gridFSBucket.delete(file[0]._id);
        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting file", details: error.message });
    }
});

module.exports = router;
