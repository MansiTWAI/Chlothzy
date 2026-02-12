import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function to add product
const addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      subCategory, 
      sizes, 
      bestseller,
      fabric,
      occasion,
      fit,
      color 
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    
    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes,
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
      
      // ── newly added fields ──
      fabric: fabric || undefined,       // will be saved only if provided
      occasion: occasion || undefined,
      fit: fit || undefined,
      color: color || undefined
    };

    console.log("Creating product with data:", productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get single product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// ── Update Entire Product (Admin only) ─────────────────
const updateProduct = async (req, res) => {
  try {
    const {
      id,               
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      fabric,
      occasion,
      fit,
      color,
      discount
    } = req.body;

    // 1. Prepare scalar updates (only include fields that were sent)
    const updateData = {};

    if (name !== undefined)          updateData.name = name.trim();
    if (description !== undefined)   updateData.description = description.trim();
    if (price !== undefined)         updateData.price = Number(price);
    if (category !== undefined)      updateData.category = category;
    if (subCategory !== undefined)   updateData.subCategory = subCategory;
    if (sizes !== undefined) {
      updateData.sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    }
    if (bestseller !== undefined)    updateData.bestseller = bestseller === "true" || bestseller === true;
    if (fabric !== undefined)        updateData.fabric = fabric;
    if (occasion !== undefined)      updateData.occasion = occasion;
    if (fit !== undefined)           updateData.fit = fit;
    if (color !== undefined)         updateData.color = color;
    if (discount !== undefined)      updateData.discount = Number(discount);

    // 2. Handle images – partial updates (most important fix)
    if (req.files && Object.keys(req.files).length > 0) {
      const imageFields = ["image1", "image2", "image3", "image4"];

      // Get current product so we can merge images
      const currentProduct = await productModel.findById(id).select("image").lean();
      if (!currentProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      let currentImages = currentProduct.image || [];

      // Upload new images and place them in correct positions
      for (let i = 0; i < 4; i++) {
        const field = imageFields[i];
        if (req.files[field] && req.files[field][0]) {
          const result = await cloudinary.uploader.upload(
            req.files[field][0].path,
            { resource_type: "image" }
          );
          // Replace or append in correct position (0-based)
          currentImages[i] = result.secure_url;
        }
      }

      // Remove any trailing undefined / empty slots if you want clean array
      currentImages = currentImages.filter(Boolean);

      updateData.image = currentImages;
    }

    // If nothing to update → early response (optional but nice UX)
    if (Object.keys(updateData).length === 0) {
      return res.json({ success: true, message: "No changes to apply" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export { addProduct, listProducts, removeProduct, singleProduct, updateProduct};