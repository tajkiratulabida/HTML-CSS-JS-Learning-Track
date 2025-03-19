// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: { city: { type: String }, district: { type: String }, address: { type: String }, phone: { type: String } },
  
  status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);

