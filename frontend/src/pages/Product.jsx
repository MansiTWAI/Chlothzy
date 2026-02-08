import React, { useContext, useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import { Heart } from 'lucide-react'; // <- Added Heart icon

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, getPriceDisplay, isWishlisted, toggleWishlist } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const fetchProductData = () => {
    const item = products.find((product) => product._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
      setIsAdded(false);
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }
    addToCart(productData._id, size);
    setIsAdded(true);
  };

  if (!productData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const { sale, mrp, discountText, hasDiscount } = getPriceDisplay(productData);
  const wishlisted = isWishlisted(productData._id);

  return (
    <div className="border-t pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto gap-3 lg:w-24 lg:max-h-[500px]">
            {productData.image.map((img, index) => (
              <img
                key={index}
                onClick={() => setImage(img)}
                src={img}
                alt={`${productData.name} - view ${index + 1}`}
                className={`w-20 lg:w-full aspect-square object-cover cursor-pointer rounded-md border-2 transition-all ${
                  image === img ? 'border-black' : 'border-transparent hover:border-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex-1 relative">
            <img
              className="w-full h-auto rounded-lg shadow-lg object-cover max-h-[600px]"
              src={image}
              alt={productData.name}
            />
            {/* Wishlist Heart */}
            <button
              onClick={() => toggleWishlist(productData._id)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow-md transition-all hover:scale-110"
            >
              <Heart
                size={22}
                className={wishlisted ? 'fill-[#8B4513] text-[#8B4513]' : 'text-gray-400 hover:text-[#8B4513]'}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-3xl lg:text-4xl mt-2">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-3">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt="star" className="w-4 h-4" />
            ))}
            <img src={assets.star_dull_icon} alt="half star" className="w-4 h-4" />
            <p className="pl-2 text-sm text-gray-600">(122 reviews)</p>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="text-4xl font-semibold text-black">{sale}</p>
            {hasDiscount && (
              <>
                <p className="text-2xl text-gray-500 line-through">{mrp}</p>
                <span className="text-lg font-medium text-green-600 bg-green-100 px-3 py-1 rounded">
                  {discountText}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-gray-600 md:w-5/6 leading-relaxed">{productData.description}</p>

          <div className="mt-8">
            <p className="font-medium mb-3">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {productData.sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => { setSize(item); setIsAdded(false); }}
                  className={`min-w-12 py-2 px-4 border rounded-md text-sm font-medium transition-colors ${
                    size === item
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Flipped Add to Cart / Go to Cart Button */}
          <div className="mt-8">
            {!isAdded ? (
              <button
                onClick={handleAddToCart}
                disabled={!size}
                className={`group relative overflow-hidden w-full sm:w-[280px] h-[56px] flex items-center justify-center rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  size 
                    ? 'bg-[#8B4513] text-white hover:bg-[#6F370F] shadow-lg shadow-[#8B4513]/20 active:scale-95' 
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Cart
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/cart')}
                className="w-full sm:w-[280px] h-[56px] flex items-center justify-center gap-3 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:bg-black shadow-xl shadow-black/10 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <span className="flex items-center gap-2">
                  View in Cart
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            )}
          </div>

          <hr className="my-8 border-gray-200 sm:w-4/5" />

          <div className="text-sm text-gray-500 space-y-2">
            <p>✓ 100% Original Product</p>
            <p>✓ Cash on Delivery available</p>
            <p>↩ Easy return & exchange within 7 days</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex border-b">
          <button className="border px-6 py-3 text-sm font-medium border-b-2 border-black -mb-px">
            Description
          </button>
          <button className="border px-6 py-3 text-sm font-medium hover:bg-gray-50 transition">
            Reviews (122)
          </button>
        </div>
        <div className="border border-t-0 px-6 py-8 text-sm text-gray-600 space-y-6">
          <p>Made from soft, breathable fabric, this product ensures all-day comfort...</p>
          <p>Elevate your style with this thoughtfully designed product...</p>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
