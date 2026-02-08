// models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "product", 
      required: true 
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },           // ← keep as MRP (original)
    finalPrice: { type: Number, required: true },      // ← NEW: discounted price
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    image: { type: String, required: false }
  }],
  amount: { type: Number, required: true },            // should be sum of finalPrice × quantity
  address: { type: Object, required: true },
  status: { type: String, default: 'Order Placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number, default: Date.now },
  estimatedDelivery: {
    type: String,
    required: false,
    trim: true,
    default: "Processing"
  }
}, { 
  timestamps: true 
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;