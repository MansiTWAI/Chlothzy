import React, { useContext, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const Products = ({ title = 'Our Best Sellers', count = 4 }) => {
  const { products = [] } = useContext(ShopContext);
  const navigate = useNavigate();

  // Get top-selling products
  const bestSellers = useMemo(() => {
    if (!products?.length) return [];
    return [...products]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0)) // Sort by sold descending
      .slice(0, count);
  }, [products, count]);

  const isLoading = products.length === 0 && bestSellers.length === 0;

  return (
    <section className="w-full bg-white py-10 md:py-12">
      <div className="max-w-339 mx-auto px-5 xl:px-0">

        {/* Heading */}
        <div className="mb-8 md:mb-10 flex flex-col items-start">
          <h2 
            className="text-[#2D241E] uppercase"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 'clamp(32px, 5vw, 76px)',
              lineHeight: '120%',
              letterSpacing: '0%',
              maxWidth: '1356px',
            }}
          >
            {title}
          </h2>
          <div className="h-0.5 w-20 bg-[#8B4513] mt-4"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            [...Array(count)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-stone-100 mb-4" />
                <div className="h-4 w-1/3 bg-stone-100 mb-2" />
                <div className="h-5 w-full bg-stone-100" />
              </div>
            ))
          ) : bestSellers.length > 0 ? (
            bestSellers.map((item) => (
              <div key={item._id}>
                <ProductItem 
                  id={item._id} 
                  image={item.image} 
                  name={item.name} 
                  price={item.price}
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-12">
              No best sellers available yet.
            </p>
          )}
        </div>

        {/* See More Button */}
        <div className="mt-10 md:mt-12">
          <button 
            onClick={() => navigate('/collection')}
            className="flex items-center justify-between px-8 py-3 bg-[#8B4513] text-white text-[11px] font-bold uppercase tracking-[0.2em] min-w-[180px] hover:bg-[#2D241E] transition-all duration-300"
          >
            <span>See More</span>
            <ArrowRight size={16} className="ml-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;
