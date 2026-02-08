import express from "express";
import authUser from "../middleware/auth.js";
import {
  toggleWishlist,
  getWishlist
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/toggle", authUser, toggleWishlist);
router.get("/", authUser, getWishlist);

export default router;
