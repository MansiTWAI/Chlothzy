import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import logo from '../assets/logo1.png';

const Footer = () => {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCollection = ({ category, occasion, sort } = {}) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (occasion) params.set('occasion', occasion);
    if (sort)     params.set('sort', sort);

    const query = params.toString();
    navigate(`/collection${query ? `?${query}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#8B4513] text-[#F5F5F4] pt-16 pb-12 px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
      <div className="max-w-[1357px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col gap-8 w-full lg:max-w-[290px]">
            
            {/* LOGO WITH SPECIFIC DIMENSIONS & POSITIONING */}
            <div 
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => goTo('/')}
              style={{
                width: '93px',
                height: '93px',
                opacity: 1,
                rotate: '0deg',
              }}
            >
              <img
                src={logo}
                alt="CHLOTHZY"
                className="w-full h-full object-contain brightness-110"
                style={{ mixBlendMode: 'lighten' }}
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-[13px] font-light leading-relaxed">
              <div className="grid grid-cols-[85px_1fr] gap-0">
                <span className="font-medium text-white">WhatsApp</span>
                <span className="text-stone-200">: +91 9211364653</span>
              </div>
              <div className="grid grid-cols-[85px_1fr] gap-0">
                <span className="font-medium text-white">Email</span>
                <span className="break-all text-stone-300">: contact@chlothzy.shop</span>
              </div>
              <div className="grid grid-cols-[85px_1fr] gap-0">
                <span className="font-medium text-white">Address</span>
                <span className="text-stone-300">: Unit 132, Malabar Hills, Mumbai, 400006</span>
              </div>
              {/* Added Instagram detail here */}
              <div className="grid grid-cols-[85px_1fr] gap-0 items-center">
                <span className="font-medium text-white">Instagram</span>
                <span className="text-stone-300 flex items-center gap-1">
                  : <a 
                      href="https://www.instagram.com/chlothzy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <Instagram size={12} /> @chlothzy
                    </a>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-4 lg:max-w-[970px]">
            {/* Shop Column */}
            <div className="flex flex-col">
              <h4 className="text-[15px] font-semibold mb-6 text-white capitalize">Menu</h4>
              <ul className="flex flex-col gap-3 text-[13px] font-light opacity-90">
                <li onClick={() => goToCollection({ sort: 'discount' })} className="cursor-pointer hover:underline underline-offset-4">Sale</li>
                <li onClick={() => goToCollection({ sort: 'newest' })} className="cursor-pointer hover:underline underline-offset-4">New Arrivals</li>
                <li onClick={() => goToCollection({ category: 'men', occasion: 'formal' })} className="cursor-pointer hover:underline underline-offset-4">Formal Men</li>
                <li onClick={() => goToCollection({ category: 'women', occasion: 'formal' })} className="cursor-pointer hover:underline underline-offset-4">Formal Women</li>
                <li onClick={() => goToCollection({ category: 'men', occasion: 'casual' })} className="cursor-pointer hover:underline underline-offset-4">Casual Men</li>
                <li onClick={() => goToCollection({ category: 'women', occasion: 'casual' })} className="cursor-pointer hover:underline underline-offset-4">Casual Women</li>
              </ul>
            </div>

            {/* Get Help Column */}
            <div className="flex flex-col">
              <h4 className="text-[15px] font-semibold mb-6 text-white capitalize">Get Help</h4>
              <ul className="flex flex-col gap-3 text-[13px] font-light opacity-90">
                <li onClick={() => goTo('/faq')} className="cursor-pointer hover:underline underline-offset-4">FAQ</li>
                <li onClick={() => goTo('/contact')} className="cursor-pointer hover:underline underline-offset-4">Customer Service</li>
                <li onClick={() => goTo('/returns')} className="cursor-pointer hover:underline underline-offset-4">Refund and Return</li>
                <li onClick={() => goTo('/terms')} className="cursor-pointer hover:underline underline-offset-4">Terms and Conditions</li>
                <li onClick={() => goTo('/shipping')} className="cursor-pointer hover:underline underline-offset-4">Shipping</li>
              </ul>
            </div>

            {/* Account Column */}
            <div className="flex flex-col">
              <h4 className="text-[15px] font-semibold mb-6 text-white capitalize">Account</h4>
              <ul className="flex flex-col gap-3 text-[13px] font-light opacity-90">
                <li onClick={() => goTo('/login')} className="cursor-pointer hover:underline underline-offset-4">My Account</li>
                <li onClick={() => goTo('/orders')} className="cursor-pointer hover:underline underline-offset-4">My Orders</li>
                <li onClick={() => goToCollection({ occasion: 'offers' })} className="cursor-pointer hover:underline underline-offset-4">Vouchers & Discounts</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;