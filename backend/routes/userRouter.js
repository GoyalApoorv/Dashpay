const express = require("express");
const zod = require("zod");
const router = express.Router();
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config")
const bcrypt = require("bcrypt")
const crypto = require("crypto");
const { authMiddleware } = require("../authMiddleware")
const { sendVerificationEmail } = require("../utils/emailService");
const saltRounds = 10

const signupSchema = zod.object(
    {
        username: zod.string().email(),
        firstName: zod.string(),
        lastName: zod.string(),
        password: zod.string()
    }
)

router.post("/signup", async (req, res) => {
    const { success, data } = signupSchema.safeParse(req.body);

    if (!success) {
        res.status(400).json({
            message: "Invalid inputs"
        })
        return;
    }

    const { username, password, firstName, lastName } = data;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await User.create({
            username,
            firstName,
            lastName,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
            verificationTokenExpires
        });

        // Send verification email
        try {
            await sendVerificationEmail(username, verificationToken, firstName);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Continue with signup even if email fails
        }

        // Initializing an account for the user
        await Account.create({
            userId: user._id,
            balance: 1 + Math.random() * 10000
        })

        res.status(201).json({
            message: "Account created! Please check your email to verify your account before signing in.",
            email: username
        })

    } catch (error) {
        console.error("Signup error:", error);
        console.error("Error details:", error.message);
        if (error.errors) {
            console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        }
        console.error("Request body:", req.body);
        res.status(500).json({
            message: "An internal error occurred"
        });
    }
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    try {
        const user = await User.findOne({
            username: req.body.username
        });

        if (user && await bcrypt.compare(req.body.password, user.password)) {
            // Check if email is verified
            if (!user.isVerified) {
                return res.status(403).json({
                    message: "Please verify your email before signing in. Check your inbox for the verification link."
                });
            }

            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET);

            res.json({
                token: token
            })
            return;
        }

        res.status(411).json({
            message: "Error while logging in"
        })

    } catch (error) {
        res.status(500).json({
            message: "An internal error occurred"
        })
    }
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success, data } = updateBody.safeParse(req.body);

    if (!success) {
        res.status(400).json({
            message: "Error while updating information"
        })
    }

    const { password, firstName, lastName } = data;

    const updatePayload = {};

    if (firstName) {
        updatePayload.firstName = firstName;
    }
    if (lastName) {
        updatePayload.lastName = lastName;
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updatePayload.password = hashedPassword;
    }

    // Only update if there are fields to update
    if (Object.keys(updatePayload).length === 0) {
        return res.status(400).json({
            message: "No fields to update."
        });
    }

    await User.updateOne({ _id: req.userId }, { $set: updatePayload });

    res.status(200).json({
        message: "User updated successfully"
    })
})

router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        _id: { $ne: req.userId }, // Exclude current user
        $or: [{
            firstName: {
                $regex: filter,
                $options: 'i' // Case-insensitive
            }
        }, {
            lastName: {
                $regex: filter,
                $options: 'i' // Case-insensitive
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password"); // Exclude the password hash

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error("Error in /me route:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Email verification endpoint
router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: "Verification token is required" });
        }

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({
            message: "Email verified successfully!",
            success: true
        });

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Verification failed" });
    }
});

// Resend verification email
router.post("/resend-verification", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.username, verificationToken, user.firstName);

        res.json({ message: "Verification email sent successfully" });

    } catch (error) {
        console.error("Resend verification error:", error);
        res.status(500).json({ message: "Failed to resend verification email" });
    }
});

module.exports = router
