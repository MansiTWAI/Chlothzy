import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  quantity: { type: Number, default: 1 },
  size: String,
  color: String
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    cart: [cartItemSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }]
  },
  { timestamps: true }
);

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
