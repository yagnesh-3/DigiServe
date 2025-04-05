import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [imageList, setImageList] = useState([]);

    // Handle File Change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Upload Image
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            await axios.post("http://localhost:3000/upload", formData);
            alert("Image uploaded successfully!");
            fetchImages();
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // Fetch Images List
    const fetchImages = async () => {
        try {
            const response = await axios.get("http://localhost:3000/files");
            setImageList(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    // Delete Image
    const handleDelete = async (filename) => {
        try {
            await axios.delete(`http://localhost:3000/image/${filename}`);
            alert("Image deleted successfully!");
            fetchImages();
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    // Fetch images on component mount
    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Image Uploader</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
                Upload
            </button>

            <h3>Uploaded Images</h3>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                {imageList.map((image) => (
                    <div key={image._id} style={{ margin: "10px", textAlign: "center" }}>
                        <img
                            src={`http://localhost:3000/image/${image.filename}`}
                            alt={image.filename}
                            style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <br />
                        <button onClick={() => handleDelete(image.filename)} style={{ marginTop: "5px" }}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
