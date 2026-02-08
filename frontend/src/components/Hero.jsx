import React, { useContext, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hero from '../assets/hero.png';
import { ShopContext } from '../context/ShopContext';

const Hero = () => {
  const { products = [], currency = '₹' } = useContext(ShopContext);
  const navigate = useNavigate();

  // Get the 2 most recently added products
  const latestProducts = useMemo(() => {
    if (!products?.length) return [];
    return [...products]
      .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
      .slice(0, 2);
  }, [products]);

  const goToProduct = (id) => {
    if (id) navigate(`/product/${id}`);
  };

  // Smooth scroll function for the bottom indicator
  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  // Helper for dynamic price calculation
  const getPricing = (product) => {
    const mrp = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const salePrice = discount > 0 ? Math.round(mrp * (1 - discount / 100)) : mrp;
    return {
      mrp: mrp.toLocaleString('en-IN'),
      sale: salePrice.toLocaleString('en-IN'),
      discount,
      hasDiscount: discount > 0
    };
  };

  return (
    <section className="relative -mt-10 w-full h-screen bg-[#D6C4B8] overflow-hidden">
      {/* Background Image - Clickable to Collection */}
      <img
        src={hero}
        alt="Fashion Model"
        className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer transition-opacity duration-500 hover:opacity-95"
        onClick={() => navigate('/collection')}
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end md:items-center justify-between h-full pb-16 md:pb-0">
          
          {/* Left Side: Editorial Text - Clickable */}
          <div 
            className="text-white w-full md:w-2/3 pt-24 md:pt-0 cursor-pointer group/hero-text"
            onClick={() => navigate('/collection')}
          >
            <h4 className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold mb-4 opacity-90 group-hover/hero-text:translate-x-2 transition-transform duration-300">
              Made in India, Dedicated to India
            </h4>
            <h1 className="text-5xl md:text-7xl lg:text-[76px] font-serif leading-[0.9] mb-6 drop-shadow-md group-hover/hero-text:scale-[1.01] transition-transform duration-300">
              DISCOVER THE ART OF <br /> DRESSING UP
            </h1>
          </div>

          {/* Right Side: Floating Product Cards */}
          <div className="w-full md:w-auto flex flex-col items-end gap-5 md:gap-8">
            
            {latestProducts.map((product, index) => {
              const pricing = getPricing(product);
              const isSecond = index === 1;

              return (
                <div 
                  key={product._id}
                  className={`group bg-white flex ${isSecond ? 'flex-row-reverse md:translate-x-12' : ''} items-stretch w-72 md:w-96 shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.25)] relative overflow-hidden`}
                  onClick={() => goToProduct(product._id)}
                >
                  {/* Image Section */}
                  <div className="w-[40%] bg-[#f9f9f9] overflow-hidden">
                    <img
                      src={product.image?.[0] || hero}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Content Section */}
                  <div className={`w-[60%] p-5 md:p-6 flex flex-col justify-center relative ${isSecond ? 'text-right items-end' : 'text-left items-start'}`}>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-[#8B4513] font-bold mb-2">
                      New Arrival
                    </span>

                    <h5 className="text-sm md:text-lg font-serif text-[#2D241E] leading-tight mb-2 line-clamp-2">
                      {product.name}
                    </h5>
                    
                    {/* Price Area */}
                    <div className={`flex items-baseline gap-2 mb-4 ${isSecond ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-base md:text-xl font-bold text-[#2D241E]">
                        {currency}{pricing.sale}
                      </span>
                      {pricing.hasDiscount && (
                        <span className="text-[10px] md:text-xs text-stone-400 line-through decoration-stone-300">
                          {currency}{pricing.mrp}
                        </span>
                      )}
                    </div>

                    {/* Action Link */}
                    <div className="relative overflow-hidden group/btn">
                      <div className="text-[10px] uppercase tracking-widest font-black text-[#2D241E] flex items-center gap-2">
                        {isSecond ? 'Shop Collection' : 'View Piece'}
                        <div className={`h-[1px] w-4 bg-[#2D241E] transition-all duration-300 group-hover/btn:w-8`} />
                      </div>
                    </div>

                    {/* Elegant Discount Badge */}
                    {pricing.hasDiscount && (
                      <div className={`absolute top-0 ${isSecond ? 'left-0' : 'right-0'} bg-[#2D241E] text-white text-[9px] px-3 py-1 font-bold tracking-tighter uppercase`}>
                        {pricing.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Clickable Scroll Down Indicator */}
      <button 
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 group cursor-pointer focus:outline-none"
      >
        <span className="text-[8px] uppercase tracking-[0.4em] font-bold group-hover:tracking-[0.5em] transition-all duration-300">
          Scroll Down
        </span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;