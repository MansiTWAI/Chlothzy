import userModel from "../models/userModel.js";

/* =========================
   ADD TO CART
========================= */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { itemId, size, color } = req.body; // add color if needed

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Check if item already exists in cart (same product + size + color)
    const existingItem = user.cart.find(
      (c) =>
        c.productId.toString() === itemId &&
        c.size === size &&
        c.color === (color || "")
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productId: itemId, size, color: color || "", quantity: 1 });
    }

    await user.save();

    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE CART
========================= */
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size, color, quantity } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const itemIndex = user.cart.findIndex(
      (c) =>
        c.productId.toString() === itemId &&
        c.size === size &&
        c.color === (color || "")
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        user.cart.splice(itemIndex, 1); // remove item if quantity 0
      } else {
        user.cart[itemIndex].quantity = quantity;
      }
      await user.save();
      return res.json({ success: true, message: "Cart updated" });
    }

    res.status(404).json({ success: false, message: "Item not found in cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET USER CART
========================= */
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).populate("cart.productId");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Convert array to frontend object format { productId: { size: quantity } }
    const cartData = {};
    user.cart.forEach((item) => {
      const pid = item.productId._id.toString();
      if (!cartData[pid]) cartData[pid] = {};
      cartData[pid][item.size] = item.quantity;
    });

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
