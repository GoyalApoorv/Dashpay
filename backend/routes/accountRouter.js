const express = require('express');
const { authMiddleware } = require('../authMiddleware');
const { Account, User, Transaction } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const userTransactions = await Transaction.findOne({ userId: req.userId });

        if (!userTransactions) {
            return res.json({ transactions: [] });
        }
        // Return the last 5 transactions
        const recentTransactions = userTransactions.transactions.slice(-5).reverse();
        res.json({ transactions: recentTransactions });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    try {
        const { amount, to } = req.body;
        console.log("Transfer request:", { amount, to, from: req.userId });

        // Find accounts for the transfer
        const fromAccount = await Account.findOne({ userId: req.userId });
        console.log("From account:", fromAccount);

        if (!fromAccount || fromAccount.balance < amount) {
            console.log("Insufficient balance:", { balance: fromAccount?.balance, amount });
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to });
        console.log("To account:", toAccount);

        if (!toAccount) {
            console.log("Invalid recipient");
            return res.status(400).json({ message: "Invalid recipient account" });
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } });
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } });

        // Get user details for transaction logging
        const fromUser = await User.findById(req.userId);
        const toUser = await User.findById(to);
        const date = new Date();

        // For the sender
        await Transaction.updateOne({ userId: req.userId }, {
            $push: {
                transactions: {
                    toUserId: to,
                    toFirstName: toUser.firstName,
                    toLastName: toUser.lastName,
                    amount: amount,
                    status: 'Sent',
                    date: date
                }
            }
        }, { upsert: true });

        // For the receiver
        await Transaction.updateOne({ userId: to }, {
            $push: {
                transactions: {
                    toUserId: req.userId,
                    toFirstName: fromUser.firstName,
                    toLastName: fromUser.lastName,
                    amount: amount,
                    status: 'Received',
                    date: date
                }
            }
        }, { upsert: true });

        res.json({ message: "Transfer successful" });

    } catch (error) {
        console.error("Error during transfer:", error);
        return res.status(500).json({ message: "An error occurred during the transfer." });
    }
});

module.exports = router;