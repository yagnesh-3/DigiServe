const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.body.token   // Support both body and Bearer token

        // console.log("Received Token:", token);

        if (!token) {
            return res.status(401).json({ status: false, message: "Auth Failed: No token provided" });
        }

        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        next(); // Proceed to next middleware

    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ status: false, message: "Auth Failed: Token expired" });
        }

        return res.status(401).json({ status: false, message: "Auth Failed: Invalid token" });
    }
};

module.exports = auth;
