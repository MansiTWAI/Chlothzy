import React from 'react';
import { useNavigate } from 'react-router-dom';
import category1 from '../assets/fit1.png';
import category2 from '../assets/fit2.png';
import category3 from '../assets/fit3.png';

const Categories = () => {
  const navigate = useNavigate();

  const handleClick = (categoryName) => {
    // Navigate to /collection with query param ?category=...
    navigate(`/collection?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="px-6 md:px-12 lg:px-20 py-10 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[750px]">
          
          {/* Left Column: Stacked Formal Sections */}
          <div className="grid grid-rows-2 gap-6">
            <div
              className="relative group overflow-hidden cursor-pointer"
              onClick={() => handleClick('Formal Woman')}
            >
              <img 
                src={category1} 
                alt="Formal Woman" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center md:justify-start p-8 lg:p-12">
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight uppercase">
                  Formal Woman
                </h2>
              </div>
            </div>

            <div
              className="relative group overflow-hidden cursor-pointer"
              onClick={() => handleClick('Men')}
            >
              <img 
                src={category2} 
                alt="Formal Men" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center md:justify-start p-8 lg:p-12">
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight uppercase">
                  Formal Men
                </h2>
              </div>
            </div>
          </div>

          {/* Right Column: Tall Casual Section */}
          <div
            className="relative group overflow-hidden cursor-pointer h-[500px] md:h-full"
            onClick={() => handleClick('Casual Style')}
          >
            <img 
              src={category3} 
              alt="Casual Style" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center p-8">
              <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight uppercase text-center md:text-left leading-none">
                Casual <br className="hidden md:block" /> Style
              </h2>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Categories;
