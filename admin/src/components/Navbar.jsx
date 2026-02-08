import React from 'react';
import { Link } from 'react-router-dom'; // Added missing import
import logo from '../assets/logo.jpeg'


const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-4 px-[6%] justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#8B4513]/5'>
      
      {/* Brand Logo */}
       <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <img
                    src={logo}
                    className="w-24 sm:w-32 md:w-36 lg:w-40 h-15 object-contain"
                    alt="Company Logo"
                  />
                </Link>
              </div>

      {/* Action Buttons */}
      <div className='flex items-center gap-4'>
        <button 
          onClick={() => setToken('')} 
          className='bg-[#3d2b1f] text-white px-6 py-2 sm:px-8 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase shadow-lg shadow-[#3d2b1f]/20 hover:bg-[#8B4513] transition-all active:scale-95'
        >
          Logout
        </button>
      </div>
      
    </div>
  );
};

export default Navbar;