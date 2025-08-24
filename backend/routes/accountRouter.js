// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../authMiddleware');
const { User, Account } = require('../db');
const { boolean } = require('zod');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (requestAnimationFrame, res) => {
    const account = User.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
})

router.get("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    const { amount, to} = req.body;

    session.startTransaction();
    
    const account = User.findOne({ userId: req.userId}).session(session);

    if(!account || account.balance < amount) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if(!toAccount || toAccount.balance < amount) {
        session.abortTransaction();
         res.status(400).json({
            message: "Insufficient balance"
        });
    }

    // Performing the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    session.commitTransaction();
    res.json({
        message: "Transfer successful"
    })
})

module.exports = router;