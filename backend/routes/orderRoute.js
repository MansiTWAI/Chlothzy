import express from 'express';
import { placeOrder, allOrders, userOrders, updateStatus, cancelOrder } from '../controllers/orderController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus); // can update status + expectedDelivery

// User routes
orderRouter.post('/place', authUser, placeOrder);       // user can place order + optional expectedDelivery
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.post('/cancel', authUser, cancelOrder);

export default orderRouter;
