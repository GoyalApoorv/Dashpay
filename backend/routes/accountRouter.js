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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        // Validation
        if (req.userId === to) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Cannot transfer money to yourself"
            });
        }

        if (!amount || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid transfer amount"
            });
        }

        // Find and validate accounts WITHIN transaction
        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);

        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid recipient account" });
        }

        // Perform atomic transfer
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        // Log transactions
        const fromUser = await User.findById(req.userId).session(session);
        const toUser = await User.findById(to).session(session);
        const date = new Date();

        await Transaction.updateOne(
            { userId: req.userId },
            {
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
            },
            { upsert: true, session }
        );

        await Transaction.updateOne(
            { userId: to },
            {
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
            },
            { upsert: true, session }
        );

        // Commit transaction
        await session.commitTransaction();
        res.json({ message: "Transfer successful" });

    } catch (error) {
        await session.abortTransaction();
        console.error("Transfer failed:", error);
        return res.status(500).json({
            message: "Transfer failed. Please try again."
        });
    } finally {
        session.endSession();
    }
});

module.exports = router;