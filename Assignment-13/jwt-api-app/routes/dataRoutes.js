const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

// Protected Route (JWT Token)
router.get("/protected", auth, (req, res) => {
  res.json({ message: "Access Granted!", user: req.user });
});

module.exports = router;
