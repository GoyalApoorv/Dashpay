const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

// CORS configuration for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});