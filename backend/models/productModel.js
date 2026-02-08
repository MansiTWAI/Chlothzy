import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  price: { type: Number, required: true }, // MRP
  discount: { type: Number, default: 0 },  // %

  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },

  fabric: { type: String },
  occasion: { type: String },
  fit: { type: String },
  color: { type: String },

  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});

// ✅ Virtual final price
productSchema.virtual("finalPrice").get(function () {
  if (!this.discount) return this.price;
  return Math.round(this.price - (this.price * this.discount) / 100);
});

// ✅ Enable virtuals in API
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
