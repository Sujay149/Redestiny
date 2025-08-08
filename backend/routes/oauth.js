import express from 'express';
import jwt from 'jsonwebtoken';
import passport from '../passport.js';

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, email: user.email, photoURL: user.photoURL }, process.env.JWT_SECRET, { expiresIn: '7d' });
  // Send token and user info as query params or render a page that posts message to opener
  const params = new URLSearchParams({
    token,
    email: user.email,
    photoURL: user.photoURL || ''
  });
  res.redirect(`/oauth-success.html?${params.toString()}`);
});



export default router;
