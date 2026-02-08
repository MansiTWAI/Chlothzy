import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  // Shared styling for the active state
  const activeLink = "flex items-center gap-3 bg-[#8B4513] text-white shadow-lg shadow-[#8B4513]/20 border-[#8B4513]";
  const normalLink = "flex items-center gap-3 bg-white text-[#3d2b1f] border-gray-100 hover:bg-[#faf7f5] hover:border-[#8B4513]/20";

  return (
    <div className='w-[18%] md:w-[22%] min-h-screen border-r border-[#8B4513]/5 bg-white'>
        <div className='flex flex-col gap-5 pt-8 pl-[15%] pr-4 text-[14px]'>
            
            {/* Header / Admin Label (Optional) */}
            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 hidden md:block'>
              Management
            </p>

            <NavLink 
              className={({ isActive }) => `group transition-all duration-300 border-2 px-4 py-3 rounded-2xl ${isActive ? activeLink : normalLink}`} 
              to="/add"
            >
                <img 
                  className={`w-5 h-5 transition-all ${assets.add_icon ? '' : 'invert opacity-50'}`} 
                  src={assets.add_icon} 
                  alt="Add" 
                />
                <p className='hidden md:block font-bold tracking-tight'>Add Items</p>
            </NavLink>

            <NavLink 
              className={({ isActive }) => `group transition-all duration-300 border-2 px-4 py-3 rounded-2xl ${isActive ? activeLink : normalLink}`} 
              to="/list"
            >
                <img 
                  className='w-5 h-5' 
                  src={assets.order_icon} 
                  alt="List" 
                />
                <p className='hidden md:block font-bold tracking-tight'>Inventory List</p>
            </NavLink>

            <NavLink 
              className={({ isActive }) => `group transition-all duration-300 border-2 px-4 py-3 rounded-2xl ${isActive ? activeLink : normalLink}`} 
              to="/orders"
            >
                <img 
                  className='w-5 h-5' 
                  src={assets.order_icon} 
                  alt="Orders" 
                />
                <p className='hidden md:block font-bold tracking-tight'>Customer Orders</p>
            </NavLink>

        </div>

        {/* Bottom Decorative Element */}
        <div className='hidden md:block mt-20 px-8'>
          <div className='bg-[#faf7f5] p-5 rounded-[2rem] border border-[#8B4513]/5 text-center'>
            <p className='text-[10px] text-[#8B4513] font-bold uppercase tracking-widest'>Admin Panel</p>
            <p className='text-[11px] text-gray-400 mt-1'>CLOTHZY</p>
          </div>
        </div>
    </div>
  )
}

export default Sidebar