const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');

const router = express.Router();

// Google OAuth login
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: process.env.FRONTEND_URL + '/signin' }),
    (req, res) => {
        try {
            // Generate JWT token
            const token = jwt.sign({ userId: req.user._id }, JWT_SECRET);

            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(process.env.FRONTEND_URL + '/signin');
        }
    }
);

module.exports = router;
