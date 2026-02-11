import React from 'react';
import { ThumbsUp, Phone, Truck, CreditCard } from 'lucide-react';

const ServiceFeatures = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: 100% Satisfaction */}
        <div className="bg-[#F6F6F6] p-4">
          <div className="bg-white border border-stone-100 h-full p-8 flex flex-col items-center text-center justify-center">
            <div className="w-14 h-14 bg-[#78350F] rounded-full flex items-center justify-center text-white mb-6">
              <ThumbsUp size={24} />
            </div>
            <h3 className="text-3xl font-serif text-[#2D241E] leading-tight mb-4">
              100% Satisfaction <br /> Guaranteed
            </h3>
            <p className="text-[11px] text-stone-400 leading-relaxed max-w-[220px]">
              At Chlothzy, we stand by our craftsmanship. If your fit isn't perfect or the quality isn't premium, we'll make it right with effortless returns.
            </p>
          </div>
        </div>

        {/* Center Column: Two Horizontal Cards */}
        <div className="flex flex-col gap-6">
          {/* 24/7 Service */}
          <div className="bg-[#F6F6F6] p-4 flex-1">
            <div className="bg-white border border-stone-100 h-full p-6 flex items-center gap-6">
              <div className="w-14 h-14 bg-[#78350F] rounded-full flex items-center justify-center text-white shrink-0">
                <Phone size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-serif text-[#2D241E]">24/7 Online Service</h4>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  Our style consultants are available around the clock to help you find the perfect piece for any occasion.
                </p>
              </div>
            </div>
          </div>
          
          {/* Fast Delivery */}
          <div className="bg-[#F6F6F6] p-4 flex-1">
            <div className="bg-white border border-stone-100 h-full p-6 flex items-center gap-6">
              <div className="w-14 h-14 bg-[#78350F] rounded-full flex items-center justify-center text-white shrink-0">
                <Truck size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-serif text-[#2D241E]">Fast Delivery</h4>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  Experience swift, tracked shipping worldwide. We ensure your wardrobe updates arrive at your doorstep in record time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Payment System */}
        <div className="bg-[#F6F6F6] p-4">
          <div className="bg-white border border-stone-100 h-full p-8 flex flex-col items-center text-center justify-center">
            <div className="w-14 h-14 bg-[#78350F] rounded-full flex items-center justify-center text-white mb-6">
              <CreditCard size={24} />
            </div>
            <h3 className="text-3xl font-serif text-[#2D241E] leading-tight mb-4">
              Payment With <br /> Secure System
            </h3>
            <p className="text-[11px] text-stone-400 leading-relaxed max-w-[220px]">
              Shop with confidence using our encrypted checkout. We support all major cards and digital wallets for a seamless experience.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServiceFeatures;