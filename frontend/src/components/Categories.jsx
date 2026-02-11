import React from 'react';
import { useNavigate } from 'react-router-dom';
import category1 from '../assets/fit1.png';
import category2 from '../assets/fit2.png';
import category3 from '../assets/fit3.png';

const Categories = () => {
  const navigate = useNavigate();

  const handleClick = ({ category, occasion }) => {
    const params = new URLSearchParams();

    // Only set if value exists
    if (category) {
      params.set('category', category);
    }
    if (occasion) {
      params.set('occasion', occasion);
    }

    // If no filters → just go to /collection
    const query = params.toString();
    const destination = query ? `/collection?${query}` : '/collection';

    navigate(destination);
  };

  return (
    <section className="px-6 md:px-12 lg:px-20 py-10 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[750px]">
          
          {/* Left Column: Formal sections */}
          <div className="grid grid-rows-2 gap-6">

            {/* Formal Woman */}
            <div
              className="relative group overflow-hidden cursor-pointer"
              onClick={() => handleClick({ 
                category: 'women', 
                occasion: 'casual'   // ← change to 'formal' if more appropriate
              })}
            >
              <img 
                src={category1} 
                alt="Formal Woman category" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center md:justify-start p-8 lg:p-12">
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight uppercase">
                  Formal Woman
                </h2>
              </div>
            </div>

            {/* Formal Men */}
            <div
              className="relative group overflow-hidden cursor-pointer"
              onClick={() => handleClick({ 
                category: 'men', 
                occasion: 'formal'   // ← adjust if needed
              })}
            >
              <img 
                src={category2} 
                alt="Formal Men category" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center md:justify-start p-8 lg:p-12">
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight uppercase">
                  Formal Men
                </h2>
              </div>
            </div>
          </div>

          {/* Right Column: Casual Style */}
          <div
            className="relative group overflow-hidden cursor-pointer h-[500px] md:h-full"
            onClick={() => handleClick({ 
              category: 'women,men',    // or just 'unisex' if you have that category
              occasion: 'casual'
            })}
          >
            <img 
              src={category3} 
              alt="Casual Style category" 
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