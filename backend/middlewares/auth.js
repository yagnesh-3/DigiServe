const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        // Try to get token from Authorization header (preferred)
        let token = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.body.token) {
            // Fallback: get from request body
            token = req.body.token;
        }

        if (!token) {
            return res.status(401).json({ status: false, message: "Auth Failed: No token provided" });
        }

        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        console.log(decoded)
        next();

    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ status: false, message: "Auth Failed: Token expired" });
        }

        return res.status(401).json({ status: false, message: "Auth Failed: Invalid token" });
    }
};

module.exports = auth;
