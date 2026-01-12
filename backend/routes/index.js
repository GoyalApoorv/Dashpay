const express = require("express")
const userRouter = require("./userRouter")
const router = express.Router();
const accountRouter = require("./accountRouter");
const authRouter = require("./authRouter");

router.use("/user", userRouter);
router.use("/account", accountRouter);
router.use("/auth", authRouter);

module.exports = router;
