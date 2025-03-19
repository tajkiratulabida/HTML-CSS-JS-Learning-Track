const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Store hashed password
  role: { type: String, default: "user" },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
