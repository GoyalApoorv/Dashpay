const express = require("express");
const zod = require("zod");
const router = express.Router();
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config")
const bcrypt = require("bcrypt")
const { authMiddleware } = require("../authMiddleware")
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
    const body = express.request.body;
    const {success, data} = signupSchema.safeParse(req.body);

    if(!success) {
        req.status(400).json({
            message: "Invalid inputs"
        })
    }

    const {username, password, firstName, lastName } = data;

    try {
        const existingUser = await User.findOne({ username });

        if(existingUser) {
            return res.status(409).json({
            message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const user = await User.create({
        username, 
        firstName,
        lastName,
        hashedPassword
    });

    // Initializing an account for the user
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);
    
    res.status(201).json({
        message: "User created successfully",
        token: token
    })

    } catch (error) {
        console.error("Signup error", error);
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

    if(!success) {
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

router.get("/bulk", async (req, res) => {
        const filter = req.query.filter || " ";

        const users = await User.find({
            $or: [{
                firstName: {
                    $regex: filter
                }
            }, {
                lastName: {
                    $regex: filter
                }
            }]
        })

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user._id
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

module.exports = router
