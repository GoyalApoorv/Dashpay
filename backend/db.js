const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const dbUrl = "mongodb+srv://admin:GR9iD6C7DAdarE4A@cluster0.tkqypdn.mongodb.net/dashpay";
        console.log("Attempting to connect to MongoDB with URL:", dbUrl.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
        mongoose.connect(dbUrl)
        console.log("mongodb connected successfully")
    } catch (error) {
        console.error(" Failed to connect to the database")
        process.exit(1);
    }
}

connectDB();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactions: [{
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});


const Transaction = mongoose.model('Transaction', transactionSchema);

const Account = mongoose.model('Account', accountSchema);

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    Account,
    Transaction
};