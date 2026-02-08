import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

const Collection = () => {
  const { products, search, showSearch, filteredProducts } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [color, setColor] = useState([]);
  const [occasion, setOccasion] = useState([]);
  const [fit, setFit] = useState([]);
  const [fabric, setFabric] = useState([]);

  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  const [showAllFabrics, setShowAllFabrics] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortRef = useRef(null);

  // Filter options (unchanged)
  const colorOptions = [
    "Black", "White", "Grey", "Navy Blue", "Blue", "Green", "Red", "Pink",
    "Maroon", "Purple", "Yellow", "Orange", "Beige", "Brown", "Cream", "Off White",
    "Olive", "Mustard", "Teal", "Peach", "Lavender", "Magenta", "Turquoise",
    "Multi", "Assorted", "Gold", "Silver", "Rose Gold", "Metallic", "Charcoal"
  ];

  const categoryOptions = ["Men", "Women", "Kids", "Unisex"];

  const subCategoryOptions = [
    "T-Shirts", "Shirts", "Kurtas", "Kurtis", "Tops", "Blouses",
    "Jeans", "Trousers", "Palazzos", "Leggings", "Shorts", "Track Pants",
    "Dresses", "Sarees", "Lehengas", "Anarkalis", "Jumpsuits",
    "Hoodies", "Sweatshirts", "Jackets", "Co-ords"
  ];

  const fitOptions = [
    "Regular", "Slim", "Relaxed", "Oversized", "Skinny", "Straight",
    "Bootcut", "Flared", "Mom Fit", "Boyfriend Fit", "Tailored"
  ];

  const fabricOptions = [
    "Cotton", "Cotton Blend", "Linen", "Denim", "Polyester", "Georgette",
    "Chiffon", "Silk", "Satin", "Velvet", "Rayon", "Viscose", "Wool",
    "Khadi", "Mulmul", "Organza", "Net", "Crepe", "Chambray", "Canvas"
  ];

  const occasionOptions = [
    "Casual", "Daily Wear", "Office Wear", "Party Wear", "Festive",
    "Wedding", "Cocktail", "Ethnic", "Western", "Vacation", "College",
    "Sports", "Lounge", "Nightwear"
  ];

  const sortOptions = [
    { label: 'Recommended', value: 'relevant' },
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'low-high' },
    { label: 'Price: High to Low', value: 'high-low' },
    { label: 'Better Discount', value: 'discount' },
  ];

  const getColorFromName = (name) => {
    const colorMap = {
      black: '#000000', white: '#FFFFFF', grey: '#808080', 'navy blue': '#000080',
      blue: '#0000FF', green: '#008000', red: '#FF0000', pink: '#FFC0CB',
      maroon: '#800000', purple: '#800080', yellow: '#FFFF00', orange: '#FFA500',
      beige: '#F5F5DC', brown: '#A52A2A', cream: '#FFFDD0', 'off white': '#F5F5F5',
      olive: '#808000', mustard: '#FFDB58', teal: '#008080', peach: '#FFDAB9',
      lavender: '#E6E6FA', magenta: '#FF00FF', turquoise: '#40E0D0', multi: '#FF69B4',
      gold: '#FFD700', silver: '#C0C0C0', 'rose gold': '#B76E79', metallic: '#A9A9A9',
      charcoal: '#36454F',
    };
    return colorMap[name.toLowerCase().trim()] || '#CCCCCC';
  };

  const toggleFilter = (value, setState) => {
    const lower = value.toLowerCase();
    setState(prev => prev.includes(lower) ? prev.filter(i => i !== lower) : [...prev, lower]);
  };

  const toggleCategory    = v => toggleFilter(v, setCategory);
  const toggleSubCategory = v => toggleFilter(v, setSubCategory);
  const toggleFit         = v => toggleFilter(v, setFit);
  const toggleFabric      = v => toggleFilter(v, setFabric);
  const toggleOccasion    = v => toggleFilter(v, setOccasion);
  const toggleColor       = v => toggleFilter(v, setColor);

  // Safe filtering – prevent crashes on missing fields
  const applyFilter = () => {
    let list = showSearch && search?.trim()
      ? [...(filteredProducts || [])]
      : [...(products || [])];

    if (category.length) {
      list = list.filter(p => p?.category && category.includes(p.category.toLowerCase()));
    }
    if (subCategory.length) {
      list = list.filter(p => p?.subCategory && subCategory.includes(p.subCategory.toLowerCase()));
    }
    if (color.length) {
      list = list.filter(p => p?.color && color.includes(p.color.toLowerCase()));
    }
    if (occasion.length) {
      list = list.filter(p => p?.occasion && occasion.includes(p.occasion.toLowerCase()));
    }
    if (fit.length) {
      list = list.filter(p => p?.fit && fit.includes(p.fit.toLowerCase()));
    }
    if (fabric.length) {
      list = list.filter(p => p?.fabric && fabric.includes(p.fabric.toLowerCase()));
    }

    setFilterProducts(list);
  };

  useEffect(() => {
    applyFilter();
  }, [products, search, showSearch, filteredProducts, category, subCategory, color, occasion, fit, fabric]);

  // Sorting – safe version
  useEffect(() => {
    if (!filterProducts?.length) return;

    let sorted = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
        break;
      case 'high-low':
        sorted.sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
        break;
      case 'discount':
        sorted.sort((a, b) => (Number(b?.discount) || 0) - (Number(a?.discount) || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => {
          const da = new Date(a?.createdAt || a?.date || 0);
          const db = new Date(b?.createdAt || b?.date || 0);
          return db - da;
        });
        break;
      default:
        break;
    }

    setFilterProducts(sorted);
  }, [sortType]);

  // Close sort dropdown
  useEffect(() => {
    const handler = e => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const ITEMS_TO_SHOW_INITIALLY = 5;

  const displayedColors = showAllColors
    ? colorOptions
    : colorOptions.slice(0, ITEMS_TO_SHOW_INITIALLY);

  const displayedSubCategories = showAllSubCategories
    ? subCategoryOptions
    : subCategoryOptions.slice(0, ITEMS_TO_SHOW_INITIALLY);

  const displayedFabrics = showAllFabrics
    ? fabricOptions
    : fabricOptions.slice(0, ITEMS_TO_SHOW_INITIALLY);

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-5 pb-16">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* FILTER SIDEBAR */}
        <div className="lg:w-72 xl:w-80 flex-shrink-0">
          <div
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center justify-between lg:mb-8 cursor-pointer lg:cursor-default"
          >
            <h2 className="text-sm font-semibold tracking-wide uppercase flex items-center gap-2.5">
              <SlidersHorizontal size={17} /> Filters
            </h2>
            <ChevronDown className={`lg:hidden transition ${showFilter ? 'rotate-180' : ''}`} size={18} />
          </div>

          <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-9 mt-6 lg:mt-0`}>

            <FilterGroup title="Category" items={categoryOptions} selected={category} onChange={toggleCategory} />

            {/* Sub Category */}
            <div className="border-b border-stone-200 pb-9">
              <p className="text-xs font-semibold tracking-wide uppercase mb-4">Sub Category</p>
              <div className="flex flex-col gap-2.5">
                {displayedSubCategories.map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black flex-shrink-0"
                      checked={subCategory.includes(item.toLowerCase())}
                      onChange={() => toggleSubCategory(item)}
                    />
                    <span className={`transition ${subCategory.includes(item.toLowerCase()) ? 'font-medium text-black' : 'text-gray-600 group-hover:text-black'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
              {subCategoryOptions.length > ITEMS_TO_SHOW_INITIALLY && (
                <button
                  onClick={() => setShowAllSubCategories(!showAllSubCategories)}
                  className="mt-3 text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1.5"
                >
                  {showAllSubCategories ? 'Show Less' : `See more (${subCategoryOptions.length - ITEMS_TO_SHOW_INITIALLY})`}
                </button>
              )}
            </div>

            <FilterGroup title="Fit" items={fitOptions} selected={fit} onChange={toggleFit} />

            {/* Fabric */}
            <div className="border-b border-stone-200 pb-9">
              <p className="text-xs font-semibold tracking-wide uppercase mb-4">Fabric</p>
              <div className="flex flex-col gap-2.5">
                {displayedFabrics.map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black flex-shrink-0"
                      checked={fabric.includes(item.toLowerCase())}
                      onChange={() => toggleFabric(item)}
                    />
                    <span className={`transition ${fabric.includes(item.toLowerCase()) ? 'font-medium text-black' : 'text-gray-600 group-hover:text-black'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
              {fabricOptions.length > ITEMS_TO_SHOW_INITIALLY && (
                <button
                  onClick={() => setShowAllFabrics(!showAllFabrics)}
                  className="mt-3 text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1.5"
                >
                  {showAllFabrics ? 'Show Less' : `See more (${fabricOptions.length - ITEMS_TO_SHOW_INITIALLY})`}
                </button>
              )}
            </div>

            <FilterGroup title="Occasion" items={occasionOptions} selected={occasion} onChange={toggleOccasion} />

            {/* Color */}
            <div className="border-b border-stone-200 pb-9">
              <p className="text-xs font-semibold tracking-wide uppercase mb-4">Color</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {displayedColors.map(c => (
                  <label key={c} className="flex items-center gap-2.5 cursor-pointer group text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black flex-shrink-0"
                      checked={color.includes(c.toLowerCase())}
                      onChange={() => toggleColor(c)}
                    />
                    <div
                      className={`w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 group-hover:scale-110 transition-transform ${color.includes(c.toLowerCase()) ? 'ring-2 ring-offset-1 ring-black' : ''}`}
                      style={{ backgroundColor: getColorFromName(c) }}
                    />
                    <span className={`truncate ${color.includes(c.toLowerCase()) ? 'font-medium' : 'text-gray-600 group-hover:text-black'}`}>
                      {c}
                    </span>
                  </label>
                ))}
              </div>
              {colorOptions.length > ITEMS_TO_SHOW_INITIALLY && (
                <button
                  onClick={() => setShowAllColors(!showAllColors)}
                  className="mt-4 text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1.5"
                >
                  {showAllColors ? 'Show Less' : `See more (${colorOptions.length - ITEMS_TO_SHOW_INITIALLY})`}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* PRODUCTS AREA */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">
            <Title text1="ALL" text2="COLLECTIONS" />

            <div className="relative inline-block" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded text-sm font-medium hover:border-gray-400 transition"
              >
                {sortOptions.find(o => o.value === sortType)?.label || 'Sort by'}
                <ChevronDown size={16} className={isSortOpen ? 'rotate-180' : ''} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-20">
                  {sortOptions.map(opt => (
                    <div
                      key={opt.value}
                      className={`px-5 py-3 text-sm cursor-pointer hover:bg-gray-50 flex justify-between items-center ${sortType === opt.value ? 'bg-gray-50 font-medium' : ''}`}
                      onClick={() => {
                        setSortType(opt.value);
                        setIsSortOpen(false);
                      }}
                    >
                      {opt.label}
                      {sortType === opt.value && <Check size={14} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filterProducts.length === 0 ? (
            <div className="py-32 text-center text-gray-500">
              <p className="text-lg mb-4">No products found</p>
              <button
                onClick={() => {
                  setCategory([]);
                  setSubCategory([]);
                  setFit([]);
                  setFabric([]);
                  setColor([]);
                  setOccasion([]);
                }}
                className="text-sm underline hover:text-black"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
              {filterProducts.map(item => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name || 'Unnamed Product'}
                  price={item.price || 0}
                  image={item.image}
                  discount={item.discount}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterGroup = ({ title, items, selected, onChange }) => (
  <div className="border-b border-stone-200 pb-9">
    <p className="text-xs font-semibold tracking-wide uppercase mb-4">{title}</p>
    <div className="flex flex-col gap-2.5">
      {items.map(item => (
        <label key={item} className="flex items-center gap-3 cursor-pointer group text-sm">
          <input
            type="checkbox"
            className="w-4 h-4 accent-black flex-shrink-0"
            checked={selected.includes(item.toLowerCase())}
            onChange={() => onChange(item)}
          />
          <span className={`transition ${selected.includes(item.toLowerCase()) ? 'font-medium text-black' : 'text-gray-600 group-hover:text-black'}`}>
            {item}
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default Collection;