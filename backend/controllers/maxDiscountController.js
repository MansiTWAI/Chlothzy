import MaxDiscount from "../models/maxDiscount.js";

// Get current max discount
export const getMaxDiscount = async (req, res) => {
  try {
    const discount = await MaxDiscount.findOne({ isActive: true });
    res.json(discount || { value: 0, description: "", isActive: false });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update max discount (admin only)
export const updateMaxDiscount = async (req, res) => {
  const { value, description, isActive } = req.body;

  try {
    let discount = await MaxDiscount.findOne();
    if (discount) {
      discount.value = value;
      discount.description = description;
      discount.isActive = isActive;
      await discount.save();
    } else {
      discount = new MaxDiscount({ value, description, isActive });
      await discount.save();
    }
    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
