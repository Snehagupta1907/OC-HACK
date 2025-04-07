// routes/auth.js or wherever you define routes

const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path as needed

// POST /api/login
router.post("/login", async (req, res) => {
  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    // Find user by wallet
    let user = await User.findOne({ wallet });

    // If not found, create new user
    if (!user) {
      user = await User.create({ wallet });
    }

    // Respond with user data
    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/user/:wallet", async (req, res) => {
    const { wallet } = req.params;
  
    try {
      const user = await User.findOne({ wallet }).populate("courses");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.status(200).json({
        user_id: user._id,
        wallet: user.wallet,
        courses: user.courses,
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
