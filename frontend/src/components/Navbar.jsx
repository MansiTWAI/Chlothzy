import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import {
  Search,
  ShoppingCart,
  User,
  X,
  Menu,
  ChevronLeft,
  Heart,
} from "lucide-react";
import SearchBar from "./SearchBar";
import logo from "../assets/logo1.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const {
    showSearch,
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    wishlist,
    maxDiscount,           // ← added this line (only this)
  } = useContext(ShopContext);

  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setVisible(false);
  }, [location.pathname]);

  const navItems = [
    { title: "HOME", path: "/" },
    { title: "COLLECTION", path: "/collection" },
    { title: "ABOUT", path: "/about" },
    { title: "CONTACT", path: "/contact" },
  ];

  const cartCount = getCartCount();
  const showCartBadge = cartCount > 0;
  const wishlistCount = wishlist?.length || 0;

  // Optional safety: fallback to 20 if context not loaded / value missing
  const discountPercent = maxDiscount?.value ?? 20;
  const discountText = maxDiscount?.description 
    ? maxDiscount.description 
    : "FOR NEW MEMBERS";

  return (
    <header className="fixed top-0 left-0 w-full z-[1000]  font-sans select-none">
      {/* Top Banner */}
      {showBanner && (
        <div className="w-full bg-black text-white py-2.5 px-4 relative flex items-center justify-center z-[1002]">
          <p className="text-[10px] md:text-xs tracking-[0.15em] font-medium text-center">
            {discountPercent}% OFF {discountText} —{" "}
            <span
              onClick={() => navigate("/collection")}
              className="underline underline-offset-4 decoration-stone-600 cursor-pointer hover:text-stone-300"
            >
              SHOP NOW
            </span>
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 hover:opacity-70 transition-opacity"
            aria-label="Close banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav
        className={`w-full transition-all duration-300 px-5 sm:px-8 md:px-12 h-15 flex items-center justify-between bg-white border-b border-stone-100 ${
          isScrolled ? "py-3 shadow-sm" : "py-4 md:py-5"
        }`}
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              className="w-30 sm:w-32 md:w-36 lg:w-40 h-20 pt-1 object-contain"
              alt="Company Logo"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-800">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative transition-colors hover:text-black ${
                  isActive ? "text-black" : "text-stone-600"
                }`
              }
            >
              {item.title}
              <span
                className={`absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all duration-300 ${
                  location.pathname === item.path
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </NavLink>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5 md:gap-7 text-black">
          {/* SEARCH ICON */}
          <button
            type="button"
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            className="p-1.5 hover:bg-stone-100 rounded-full transition-colors focus:outline-none"
            aria-label="Search"
          >
            <Search size={21} strokeWidth={2} />
          </button>

          {/* WISHLIST ICON */}
          <Link
            to="/wishlist"
            className="relative p-1.5 hover:bg-stone-100 rounded-full transition-colors"
          >
            <Heart
              size={21}
              strokeWidth={2}
              className={
                wishlistCount > 0 ? "fill-[#8B4513] text-[#8B4513]" : ""
              }
            />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#8B4513] rounded-full ring-2 ring-white"></span>
            )}
          </Link>

          {/* User Dropdown */}
          <div className="relative group">
            <button
              onClick={() => !token && navigate("/login")}
              className="p-1 hover:opacity-70 transition-opacity"
              aria-label="Account"
            >
              <User size={22} strokeWidth={2} />
            </button>

            {token && (
              <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1003]">
                <div className="w-44 bg-white shadow-xl rounded-md border border-stone-200 py-4 px-5 text-sm text-stone-700">
                  {/* <div
                    className="py-2 cursor-pointer hover:text-black font-medium tracking-wide"
                    onClick={() => navigate("/profile")}
                  >
                    PROFILE
                  </div> */}
                  <div
                    className="py-2 cursor-pointer hover:text-black font-medium tracking-wide"
                    onClick={() => navigate("/orders")}
                  >
                    ORDERS
                  </div>
                  <hr className="my-2 border-stone-200" />
                  <div
                    className="py-2 cursor-pointer text-red-600 hover:text-red-700 font-medium tracking-wide"
                    onClick={logout}
                  >
                    LOGOUT
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative group p-1">
            <ShoppingCart
              size={22}
              strokeWidth={2}
              className="group-hover:opacity-80 transition-opacity"
            />
            {showCartBadge && (
              <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-black text-white text-[9px] font-bold rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setVisible(true)}
            className="lg:hidden p-1 -mr-1"
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>
      </nav>

      <SearchBar />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white z-[2000] transition-all duration-400 ease-in-out shadow-2xl overflow-hidden ${visible ? "w-full xs:w-80 sm:w-96" : "w-0"}`}
      >
        <div className="flex flex-col h-full text-black">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 p-6 cursor-pointer border-b border-stone-100"
          >
            <ChevronLeft size={20} />
            <span className="text-xs tracking-wider uppercase font-bold">
              Back
            </span>
          </div>
          <div className="flex flex-col pt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `py-4 px-8 text-sm tracking-wider uppercase border-b border-stone-50 transition-colors ${isActive ? "bg-stone-50 font-semibold" : "hover:bg-stone-50"}`
                }
              >
                {item.title}
              </NavLink>
            ))}
            <NavLink
              to="/wishlist"
              onClick={() => setVisible(false)}
              className="py-4 px-8 text-sm tracking-wider uppercase border-b border-stone-50 hover:bg-stone-50 flex justify-between items-center"
            >
              Wishlist
              {wishlistCount > 0 && (
                <span className="text-[#8B4513] text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1500] lg:hidden"
          onClick={() => setVisible(false)}
        />
      )}
    </header>
  );
};

export default Navbar;