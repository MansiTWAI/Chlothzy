import express from 'express';
import cors from 'cors';
import 'dotenv/config' 
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import wishlistRoute from './routes/wishlistRoute.js'
import maxDiscountRouter from './routes/maxDiscountRoute.js';
//app config
const app=express()
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()
//middleware
app.use(express.json())
app.use(cors())
//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use("/api/wishlist", wishlistRoute)
app.use('/api/maxDiscount', maxDiscountRouter);
app.get('/', (req,res)=>{
    res.send("API working")
})

app.listen(port , ()=>console.log("Server started on PORT :"+port))