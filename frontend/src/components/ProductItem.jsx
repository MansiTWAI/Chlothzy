import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

const ProductItem = ({ id, image, name }) => {
  const { products, getPriceDisplay, isWishlisted, toggleWishlist } =
    useContext(ShopContext);

  const product = products?.find(p => String(p._id) === String(id));

  if (!product) {
    return (
      <div className="group block">
        <div className="aspect-[3/4] bg-stone-100 animate-pulse rounded-lg" />
        <div className="mt-4 space-y-2 px-1">
          <div className="h-3 w-16 bg-stone-100 animate-pulse rounded" />
          <div className="h-5 w-full bg-stone-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  const display = getPriceDisplay(product);
  const rating = product.rating || 4.8;
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="group relative flex flex-col transition-all duration-300">
      {/* Wishlist Heart - Updated to match theme while remaining functional */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product._id);
        }}
        className="absolute top-3 left-3 z-20 p-1.5 rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <Heart
          size={18}
          className={`transition-colors ${
            wishlisted ? 'fill-[#8B4513] text-[#8B4513]' : 'text-stone-400 hover:text-[#8B4513]'
          }`}
        />
      </button>

      <Link to={`/product/${id}`} className="flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-stone-50 border border-stone-100">
          <img
            src={(image && image[0]) || product.image?.[0] || '/placeholder.jpg'}
            alt={name || product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* RATING UI - KEPT EXACTLY PER YOUR ORIGINAL SYNTAX */}
          <div className="absolute top-3 right-3 bg-[#78350F]/90 backdrop-blur-sm text-white flex items-center gap-1 px-2 py-1 rounded-sm shadow-md text-[10px] font-bold tracking-tighter">
            <Star size={10} className="fill-white" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Details - Improved spacing and typography */}
        <div className="mt-4 px-1 space-y-1">
          <p className="text-[10px] text-[#8B4513] font-bold tracking-[0.15em] uppercase">
            {product.category || product.subCategory || 'APPAREL'}
          </p>

          <h3 className="text-lg font-serif text-[#2D241E] leading-tight group-hover:text-[#8B4513] transition-colors">
            {name || product.name}
          </h3>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-sm font-bold text-[#2D241E]">
              {display.sale}
            </span>

            {display.hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 line-through">
                  {display.mrp}
                </span>
                <span className="text-[10px] text-[#8B4513] font-bold">
                  ({display.discountText})
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;