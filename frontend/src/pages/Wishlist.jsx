import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title"; // Fixed missing import

const Wishlist = () => {
  const navigate = useNavigate();

  const {
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    getPriceDisplay,
  } = useContext(ShopContext);

  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    // Logic remains exactly as provided
    const items = products.filter((p) => wishlist.includes(p._id));
    setWishlistProducts(items);
  }, [wishlist, products]);

  const handleMoveToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const defaultSize = product.sizes?.[0] || "M";
    addToCart(productId, defaultSize);
    toggleWishlist(productId);
    toast.success(`${product.name} added to bag`);
  };

  // --- Empty State ---
  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-5 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-[#8B4513]/5 flex items-center justify-center border border-[#8B4513]/10">
          <span className="text-5xl text-[#8B4513] opacity-40">♡</span>
        </div>
        <h2 className="text-2xl font-serif text-stone-800 mb-3 tracking-tight">Your wishlist is empty</h2>
        <p className="text-stone-500 max-w-xs text-sm leading-relaxed mb-8">
          Save items that you love here. They will be waiting for you when you're ready to make them yours.
        </p>
        <button
          onClick={() => navigate("/collection")}
          className="px-10 py-4 bg-[#8B4513] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#6e360f] transition-all duration-500 shadow-xl shadow-[#8B4513]/20 active:scale-95"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  // --- Active Grid ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 transition-all duration-500">
      <div className='text-center text-2xl pt-10 border-t border-stone-100'>
        <Title text1={'MY'} text2={'FAVORITES'}/>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 mt-10">
        {wishlistProducts.map((product) => {
          const display = getPriceDisplay(product);

          return (
            <div
              key={product._id}
              className="group bg-white border border-stone-100 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(139,69,19,0.15)]"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[3/4] cursor-pointer bg-stone-50">
                <img
                  onClick={() => navigate(`/product/${product._id}`)}
                  src={product.image?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Remove Button (Cross) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full text-stone-400 hover:text-rose-500 hover:rotate-90 transition-all duration-300 shadow-sm"
                  title="Remove from favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex flex-col">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#8B4513] mb-1.5 font-black opacity-80">
                  Exclusive
                </p>
                
                <h3
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="text-stone-800 font-medium text-sm sm:text-base line-clamp-1 cursor-pointer hover:text-[#8B4513] transition-colors"
                >
                  {product.name}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[#8B4513] font-bold text-sm sm:text-base">{display.sale}</span>
                  {display.hasDiscount && (
                    <span className="text-xs text-stone-300 line-through decoration-[#8B4513]/20">
                      {display.mrp}
                    </span>
                  )}
                </div>

                {/* Move to Cart Button */}
                <button
                  onClick={() => handleMoveToCart(product._id)}
                  className="mt-5 w-full py-3 bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 hover:bg-[#8B4513] hover:border-[#8B4513] hover:text-white active:scale-95"
                >
                  Move to Bag
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;