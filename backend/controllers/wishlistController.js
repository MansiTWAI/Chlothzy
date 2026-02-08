import userModel from "../models/userModel.js";

// ADD / REMOVE wishlist (toggle)
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isWishlisted = user.wishlist.includes(productId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({
      success: true,
      wishlist: user.wishlist,
      message: isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET wishlist products
export const getWishlist = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("wishlist");

    res.json({ success: true, wishlist: user.wishlist });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
