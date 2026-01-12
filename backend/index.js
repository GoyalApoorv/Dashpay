require('dotenv').config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const mainRouter = require("./routes/index");

const app = express();

// Initialize Passport
require('./config/passport')(passport);

// CORS configuration for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});