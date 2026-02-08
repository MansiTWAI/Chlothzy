import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import logo from '../assets/logo.jpeg';

const Footer = () => {
  const navigate = useNavigate();

  const handleNav = (categoryName) => {
    navigate(`/collection?category=${encodeURIComponent(categoryName)}`);
    window.scrollTo(0, 0); 
  };

  const goTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#78350F] text-[#F5F5F4] pt-16 pb-8 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Improved Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          
          {/* Column 1: Brand Logo & Contact Info */}
          <div className="space-y-6">
            <div className="flex flex-col items-start gap-4">
              <div className="bg-white/5 p-1 rounded-sm">
                <img 
                  src={logo} 
                  alt="CHLOTHZY Logo" 
                  className="w-24 md:w-28 h-auto object-contain brightness-110 contrast-105" 
                  style={{ mixBlendMode: 'lighten' }} 
                />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tighter text-white">CHLOTHZY</h2>
                <p className="text-[10px] opacity-60 tracking-[0.2em] uppercase">Elegance in every thread</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm opacity-80">
              <div className="flex gap-3">
                <span className="font-semibold text-white min-w-[70px]">WhatsApp</span>
                <span className="text-stone-300">: +91 9211364653</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-white min-w-[70px]">Email</span>
                <span className="break-all text-stone-300">: contact@chlothzy.shop</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-white min-w-[70px]">Address</span>
                <span className="text-stone-300">: Unit 132, Malabar Hills, Mumbai, 400006</span>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <span className="font-semibold text-white min-w-[70px]">Social</span>
                <a 
                  href="https://www.instagram.com/chlothzy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-stone-300"
                >
                  <Instagram size={14} /> @chlothzy
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Menu */}
          <div className="lg:pl-8">
            <h4 className="text-sm font-bold mb-7 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Menu</h4>
            <ul className="space-y-3 text-sm opacity-80">
              {['Sale', 'New Arrivals', 'Formal Men', 'Formal Woman', 'Casual Men', 'Casual Woman'].map((item) => (
                <li 
                  key={item} 
                  onClick={() => handleNav(item)} 
                  className="hover:text-white cursor-pointer transition-all hover:translate-x-1 inline-block w-full"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Get Help */}
          <div className="lg:pl-4">
            <h4 className="text-sm font-bold mb-7 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Get Help</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li onClick={() => goTo('/faq')} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">FAQ</li>
              <li onClick={() => goTo('/contact')} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">Customer Service</li>
              <li onClick={() => goTo('/returns')} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">Refund and Return</li>
              <li onClick={() => goTo('/terms')} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">Terms and Conditions</li>
              <li onClick={() => goTo('/shipping')} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">Shipping</li>
            </ul>
          </div>

          {/* Column 4: Account */}
          <div>
            <h4 className="text-sm font-bold mb-7 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Account</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li onClick={() => goTo('/login')} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">My Account</li>
              <li onClick={() => goTo('/orders')} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">My Orders</li>
              <li onClick={() => handleNav('Offers')} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">Vouchers and Discounts</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] opacity-50">
          <p className="text-center md:text-left">© {new Date().getFullYear()} CHLOTHZY CLOTHING. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a 
              href="https://www.instagram.com/chlothzy/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors"
            >
              INSTAGRAM
            </a>
            <span className="cursor-default">FACEBOOK</span>
            <span className="cursor-default">TWITTER</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;