import React, { useState } from 'react';
import Categories from '../components/Categories'; 
import ProductGrid from '../components/Products';
import ServiceFeatures from '../components/Services';
import { Star, Play } from 'lucide-react';
import img from '../assets/bottom_img.png';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';

const Home = () => {
  // ✅ Hardcoded products data
  const [dresses] = useState([
    { _id: 1, name: 'Red Dress', price: 1200, category_name: 'dress', discount: 20, maxDiscount: 30 },
    { _id: 2, name: 'Blue Dress', price: 1500, category_name: 'dress', discount: 15, maxDiscount: 30 },
    { _id: 3, name: 'Green Dress', price: 1000, category_name: 'dress', discount: 10, maxDiscount: 30 },
  ]);

  const [outfits] = useState([
    { _id: 4, name: 'Casual Outfit', price: 1800, category_name: 'outfit', discount: 25, maxDiscount: 30 },
    { _id: 5, name: 'Formal Outfit', price: 2000, category_name: 'outfit', discount: 20, maxDiscount: 30 },
    { _id: 6, name: 'Party Outfit', price: 2200, category_name: 'outfit', discount: 30, maxDiscount: 30 },
  ]);

  // Calculate discounted price
  const calculatePrice = (product) => {
    return product.price - (product.price * Math.min(product.discount, product.maxDiscount)) / 100;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D241E]">
      <Hero />
      <Categories />

      <ProductGrid 
        title="The Best Dress For The Best Woman" 
        products={dresses.map(p => ({ ...p, discountedPrice: calculatePrice(p) }))}
      />
      
      <LatestCollection
        title="Best Outfit For Your Happiness" 
        products={outfits.map(p => ({ ...p, discountedPrice: calculatePrice(p) }))}
      />

      <ServiceFeatures />

      <section className="relative h-[600px] md:h-[750px] bg-stone-200 mt-12 overflow-hidden">
        <img 
          src={img} 
          alt="Editorial Fashion" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
          <button className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
            <Play className="ml-1 fill-[#78350F] text-[#78350F]" size={28} />
          </button>
        </div>
      </section>

      {/* Testimonial Cards */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[320px] md:min-w-[380px] bg-white border border-stone-100 p-8 snap-center shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={10} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-500 italic leading-loose mb-6">
                "The attention to detail in these collections is unmatched. The fit is perfect and the fabric quality surpassed all my expectations."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200" />
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest">Customer Name</h5>
                  <p className="text-[9px] text-stone-400">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
