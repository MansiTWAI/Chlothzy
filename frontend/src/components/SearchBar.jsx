import React, { useContext, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { X, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    clearSearch,
    filteredProducts = [],
  } = useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const isCollectionPage = location.pathname.includes("/collection");

  useEffect(() => {
    if (showSearch && isCollectionPage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch, isCollectionPage]);

  useEffect(() => {
    if (!isCollectionPage && showSearch) {
      setShowSearch(false);
    }
  }, [isCollectionPage, showSearch, setShowSearch]);

  if (!isCollectionPage || !showSearch) return null;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearch(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-5 px-4 sm:px-6 lg:px-8 shadow-sm z-30 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              strokeWidth={2.2}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={setSearch}
              placeholder="Search by name, category, color, fit..."
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                         text-gray-900 placeholder:text-gray-400 text-base
                         focus:bg-white focus:border-amber-700/40 focus:ring-4 focus:ring-amber-600/10
                         outline-none transition-all duration-200"
              autoComplete="off"
              spellCheck="false"
            />

            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2
                         w-8 h-8 flex items-center justify-center
                         text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full
                         transition-colors duration-150"
                aria-label="Clear search"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowSearch(false)}
            className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close search bar"
          >
            <X size={24} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="text-gray-500 font-medium tracking-wide uppercase text-xs">
            Popular:
          </span>
          {["Denim", "Summer", "Kurtas", "Ethnic", "Casual", "Outerwear"].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setSearch({ target: { value: term } })}
              className="text-amber-800 font-medium hover:underline underline-offset-4 transition-all"
            >
              {term}
            </button>
          ))}
        </div>

        

        {search && filteredProducts.length === 0 && (
          <div className="mt-6 text-center py-8 text-gray-500">
            No products found for "<strong>{search}</strong>"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;