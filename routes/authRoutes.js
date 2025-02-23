const express = require("express");
const passport = require("../middleware/auth").passport;
const { generateToken } = require("../middleware/auth");

const router = express.Router();

// Google OAuth login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Generate JWT token and send it as a response
    const token = generateToken(req.user);
    res.json({ message: "Login successful", token });
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;