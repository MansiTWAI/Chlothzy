import express from "express";
import { getMaxDiscount, updateMaxDiscount } from "../controllers/maxDiscountController.js";
import adminAuth from "../middleware/adminAuth.js";

const maxDiscountRouter = express.Router();

// Fetch current max discount
maxDiscountRouter.get("/get", getMaxDiscount);

// Admin: update max discount
maxDiscountRouter.post("/update", adminAuth, updateMaxDiscount);

export default maxDiscountRouter;
