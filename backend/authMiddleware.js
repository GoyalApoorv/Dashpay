const jwt = require("jsonwebtoken");
const JWT_SECRET = require("./config");

const authMiddleware = (req, res, next) => {
    // Log 1: Check if the middleware is running
    console.log("--- Auth Middleware Started ---");

    const authHeader = req.headers.authorization;

    // Log 2: Check the raw Authorization header
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Error: No token or invalid header format");
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];

    // Log 3: Check the extracted token
    console.log("Extracted Token:", token);
    
    // Log 4: Check the JWT_SECRET to ensure it's loaded
    console.log("JWT Secret:", JWT_SECRET ? "Loaded" : "MISSING!");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Log 5: Check the decoded token payload
        console.log("Decoded Token Payload:", decoded);

        req.userId = decoded.userId;
        console.log("--- Auth Middleware Succeeded ---");
        next();
    } catch (err) {
        // Log 6: This is the most important log. It will show the exact error.
        console.error("!!! JWT Verification Failed:", err.message);
        return res.status(403).json({ message: "Access denied. Invalid token." });
    }
};

module.exports = {
    authMiddleware
}