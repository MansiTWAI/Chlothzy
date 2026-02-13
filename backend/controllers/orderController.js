import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { sendOrderConfirmation, sendOrderStatusMail } from "./emailController.js";

// Helper: correctly skip weekends
function addWorkingDays(startDate, daysToAdd) {
  let current = new Date(startDate);
  let added = 0;

  while (added < daysToAdd) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay(); // 0 = Sun, 6 = Sat
    if (day !== 0 && day !== 6) {
      added++;
    }
  }

  return current;
}

// PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Please login to place order" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { items, address, paymentMethod = "cod" } = req.body;

    // Validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!address || typeof address !== "object") {
      return res.status(400).json({ success: false, message: "Shipping address is required" });
    }

    const requiredAddrFields = ["name", "phone", "pincode", "city", "state", "street"];
    for (const field of requiredAddrFields) {
      if (!address[field] || String(address[field]).trim() === "") {
        return res.status(400).json({
          success: false,
          message: `Address field '${field}' is required and cannot be empty`
        });
      }
    }

    // Enrich items + calculate real final amount
    let calculatedAmount = 0;
    const enrichedItems = [];

    for (const cartItem of items) {
      if (!cartItem.productId || !cartItem.quantity || !cartItem.size) {
        return res.status(400).json({
          success: false,
          message: "Each item must have productId, quantity and size"
        });
      }

      const product = await productModel.findById(cartItem.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${cartItem.productId}`
        });
      }

      const finalPrice = product.finalPrice; // virtual getter

      enrichedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,          // MRP
        finalPrice: finalPrice,        // discounted price
        quantity: Number(cartItem.quantity),
        size: cartItem.size,
        image: product.image?.[0] || ""
      });

      calculatedAmount += finalPrice * Number(cartItem.quantity);
    }

    // Calculate estimated delivery
    const orderDate = new Date();
    const workingDaysToAdd = 5;

    const deliveryDate = addWorkingDays(orderDate, workingDaysToAdd);

    const estimatedDelivery = deliveryDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // Create & save order first
    const newOrder = new orderModel({
      userId,
      items: enrichedItems,
      amount: calculatedAmount,
      address,
      paymentMethod: paymentMethod.toLowerCase(),
      payment: paymentMethod.toLowerCase() === "cod" ? false : true,
      estimatedDelivery,                  // consistent name
    });

    await newOrder.save();

    // Now send confirmation email (after order exists)
    try {
      await sendOrderConfirmation({
        to: user.email,
        name: user.name || "Customer",
        orderId: newOrder._id,
        items: enrichedItems,
        total: calculatedAmount,
        estimatedDelivery
      });
    } catch (emailErr) {
      console.error("Confirmation email failed:", emailErr);
    }

    // Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id.toString(),
      estimatedDelivery
    });

  } catch (error) {
    console.error("Place order error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// LIST ALL ORDERS (admin)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("All orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// USER'S ORDERS
const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Please login" });
    }

    const orders = await orderModel.find({ userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("User orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//update order 
const canEditOrder = (status, role) => {

  const userEditableStatuses = [
    "Order Placed",
    "Confirmed",
    "Packing"
  ];

  const adminEditableStatuses = [
    "Order Placed",
    "Confirmed",
    "Packing",
    "Shipped",
    "Out For Delivery"
  ];

  if (role === "admin") {
    return adminEditableStatuses.includes(status);
  }

  return userEditableStatuses.includes(status);
};

// UPDATE ORDER DETAILS (admin + user)

const updateOrderDetails = async (req, res) => {
  try {
    const { orderId, name, phone, address, items } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // USER CHECK (if updating via user route)
    if (req.user && req.user.role !== "admin") {
      if (order.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not allowed" });
      }

      if (["Delivered", "Cancelled"].includes(order.status)) {
        return res.status(400).json({ success: false, message: "Cannot edit delivered/cancelled order" });
      }
    }

    // UPDATE ADDRESS / CONTACT FIELDS
    if (name) order.address.name = name;
    if (phone) order.address.phone = phone;

    if (address && typeof address === "object") {
      order.address.street = address.street || order.address.street;
      order.address.city = address.city || order.address.city;
      order.address.state = address.state || order.address.state;
      order.address.pincode = address.pincode || order.address.pincode;
      order.address.country = address.country || order.address.country;
    }

    // UPDATE ITEMS (quantity & size)
    if (Array.isArray(items)) {
      for (const updatedItem of items) {
        if (!updatedItem.productId) continue;

        const existingItem = order.items.find(i => i.productId.toString() === updatedItem.productId);
        if (!existingItem) continue;

        if (updatedItem.quantity) existingItem.quantity = Number(updatedItem.quantity);
        if (updatedItem.size) existingItem.size = updatedItem.size;

        // Optional: recalc final price if needed
        if (updatedItem.quantity || updatedItem.size) {
          const product = await productModel.findById(updatedItem.productId);
          if (product) {
            existingItem.price = product.price;
            existingItem.finalPrice = product.finalPrice;
          }
        }
      }

      // Recalculate order total
      order.amount = order.items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
    }

    // Tell Mongoose nested objects changed
    order.markModified("address");
    order.markModified("items");

    // SAVE ORDER
    await order.save();

    res.json({
      success: true,
      message: "Order updated",
      order
    });

  } catch (err) {
    console.error("Update order details error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// UPDATE STATUS + DELIVERY DATE (admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, expectedDelivery, estimatedDelivery } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    const updateData = {};

    // Status
    if (status) {
      const normalized = status
        .trim()
        .split(" ")
        .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");

      const valid = [
        "Order Placed", "Packing", "Confirmed", "Shipped",
        "Out For Delivery", "Delivered", "Cancelled"
      ];

      if (!valid.includes(normalized)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }

      updateData.status = normalized;
    }

    // Handle both possible field names from frontend
    const deliveryInput = estimatedDelivery ?? expectedDelivery;

    if (deliveryInput !== undefined) {
      let finalDate = deliveryInput?.trim() ?? null;

      // Convert YYYY-MM-DD to nice format if needed
      if (finalDate && /^\d{4}-\d{2}-\d{2}$/.test(finalDate)) {
        try {
          const d = new Date(finalDate);
          if (!isNaN(d.getTime())) {
            finalDate = d.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            });
          }
        } catch {}
      }

      updateData.estimatedDelivery = finalDate;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const updated = await orderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Send status email AFTER successful update
    try {
      const user = await userModel.findById(updated.userId);
      if (user?.email) {
        await sendOrderStatusMail({
          to: user.email,
          name: user.name || "Customer",
          orderId: updated._id,
          status: updated.status,
          estimatedDelivery: updated.estimatedDelivery
        });
      }
    } catch (emailErr) {
      console.error("Status update email failed:", emailErr);
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      order: updated
    });

  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// CANCEL ORDER (user)
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Not authorized" });
    if (!orderId) return res.status(400).json({ success: false, message: "orderId is required" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "This order does not belong to you" });
    }

    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is ${order.status.toLowerCase()}`
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { placeOrder, allOrders, userOrders, updateStatus, cancelOrder, updateOrderDetails, canEditOrder };