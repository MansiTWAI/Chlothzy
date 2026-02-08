import mongoose from "mongoose";

const maxDiscountSchema = new mongoose.Schema({
  value: { type: Number, required: true }, // e.g., 50 for 50% max discount
  description: { type: String, default: "Max discount available!" }, // optional text
  isActive: { type: Boolean, default: true }, // allow admin to hide/show
}, { timestamps: true });

export default mongoose.model("MaxDiscount", maxDiscountSchema);
