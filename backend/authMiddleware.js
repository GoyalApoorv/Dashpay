const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (res, req, next) => {
    const authHeader = req.headers.authorization; 

    if (! authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({
            message: "Token missing"
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded._id
    } catch (error) {
        
    }
}

module.exports = {
    authMiddleware
}