import React, { useState, useCallback, memo } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

// Memoized small components (same as before)
const ImageUploadLabel = memo(({ id, image, onChange }) => (
  <label htmlFor={id}>
    <img
      className="w-20 object-cover"
      src={image ? URL.createObjectURL(image) : assets.upload_area}
      alt="preview"
    />
    <input onChange={onChange} type="file" id={id} hidden accept="image/*" />
  </label>
));

const SizeButton = memo(({ size, isSelected, onClick }) => (
  <div onClick={onClick} className="cursor-pointer select-none">
    <p
      className={`${
        isSelected ? 'bg-pink-100 border-pink-500' : 'bg-slate-200 border-slate-300'
      } px-4 py-1 border rounded`}
    >
      {size}
    </p>
  </div>
));

const ColorOption = memo(({ option, isSelected, bgColor, onClick }) => (
  <div
    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-3 ${
      isSelected ? 'bg-pink-50' : ''
    }`}
    onClick={onClick}
  >
    <div
      className="w-6 h-6 rounded-full border border-gray-300"
      style={{ backgroundColor: bgColor }}
    />
    <span>{option}</span>
  </div>
));

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [fabric, setFabric] = useState('');
  const [occasion, setOccasion] = useState('');
  const [fit, setFit] = useState('');
  const [color, setColor] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  const colorOptions = [
    'Black', 'White', 'Grey', 'Navy Blue', 'Blue', 'Green', 'Red', 'Pink',
    'Maroon', 'Purple', 'Yellow', 'Orange', 'Beige', 'Brown', 'Cream', 'Off White',
    'Olive', 'Mustard', 'Teal', 'Peach', 'Lavender', 'Magenta', 'Turquoise',
    'Multi', 'Assorted', 'Gold', 'Silver', 'Rose Gold', 'Metallic', 'Charcoal',
  ];

  const fabricOptions = [
    'Cotton', 'Cotton Blend', 'Linen', 'Denim', 'Polyester', 'Georgette',
    'Chiffon', 'Silk', 'Satin', 'Velvet', 'Rayon', 'Viscose', 'Wool',
    'Khadi', 'Mulmul', 'Organza', 'Net', 'Crepe', 'Chambray', 'Canvas',
  ];

  const occasionOptions = [
    'Casual', 'Daily Wear', 'Office Wear', 'Party Wear', 'Festive',
    'Wedding', 'Cocktail', 'Ethnic', 'Western', 'Vacation', 'College',
    'Sports', 'Lounge', 'Nightwear',
  ];

  const fitOptions = [
    'Regular', 'Slim', 'Relaxed', 'Oversized', 'Skinny', 'Straight',
    'Bootcut', 'Flared', 'Mom Fit', 'Boyfriend Fit', 'Tailored',
  ];

  const subCategoryOptions = [
    'T-Shirts', 'Shirts', 'Kurtas', 'Kurtis', 'Tops', 'Blouses',
    'Jeans', 'Trousers', 'Palazzos', 'Leggings', 'Shorts', 'Track Pants',
    'Dresses', 'Sarees', 'Lehengas', 'Anarkalis', 'Jumpsuits',
    'Hoodies', 'Sweatshirts', 'Jackets', 'Co-ords',
  ];

  const sizeList = ['S', 'M', 'L', 'XL', 'XXL'];

  const getColorFromName = useCallback((name) => {
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
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('fabric', fabric);
      formData.append('occasion', occasion);
      formData.append('fit', fit);
      formData.append('color', color);
      formData.append('discount', discount);

      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Product added successfully!');
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setDiscount(0);
        setCategory('Men');
        setSubCategory('');
        setFabric('');
        setOccasion('');
        setFit('');
        setColor('');
        setSizes([]);
        setBestSeller(false);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong while adding product');
    } finally {
      setLoading(false); // Stop loader (success or error)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Images */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2 flex-wrap">
          <ImageUploadLabel
            id="image1"
            image={image1}
            onChange={(e) => setImage1(e.target.files[0] || null)}
          />
          <ImageUploadLabel
            id="image2"
            image={image2}
            onChange={(e) => setImage2(e.target.files[0] || null)}
          />
          <ImageUploadLabel
            id="image3"
            image={image3}
            onChange={(e) => setImage3(e.target.files[0] || null)}
          />
          <ImageUploadLabel
            id="image4"
            image={image4}
            onChange={(e) => setImage4(e.target.files[0] || null)}
          />
        </div>
      </div>

      {/* Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-125 px-3 py-2 border rounded"
          type="text"
          placeholder="Type here"
          required
          disabled={loading}
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-125 px-3 py-2 border rounded min-h-[100px]"
          placeholder="Write content here"
          required
          disabled={loading}
        />
      </div>

      {/* Category + Sub + Price */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="w-full sm:w-1/3">
          <p className="mb-2">Product Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="w-full sm:w-1/3">
          <p className="mb-2">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            disabled={loading}
          >
            <option value="">Select Sub Category</option>
            {subCategoryOptions.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/3">
          <p className="mb-2">Product Price</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            type="number"
            placeholder="25"
            min="0"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Discount */}
      <div className="w-full sm:w-1/3">
        <p className="mb-2">Discount (%)</p>
        <input
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value) || 0)}
          className="w-full px-3 py-2 border rounded"
          type="number"
          min="0"
          max="100"
          placeholder="0"
          disabled={loading}
        />
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3 flex-wrap">
          {sizeList.map((size) => (
            <SizeButton
              key={size}
              size={size}
              isSelected={sizes.includes(size)}
              onClick={() =>
                !loading &&
                setSizes((prev) =>
                  prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Fabric + Occasion */}
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        <div className="w-full sm:w-1/2">
          <p className="mb-2">Fabric</p>
          <select
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          >
            <option value="">Select Fabric</option>
            {fabricOptions.map((fab) => (
              <option key={fab} value={fab}>
                {fab}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <p className="mb-2">Occasion</p>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          >
            <option value="">Select Occasion</option>
            {occasionOptions.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fit + Color */}
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        <div className="w-full sm:w-1/2">
          <p className="mb-2">Fit</p>
          <select
            value={fit}
            onChange={(e) => setFit(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          >
            <option value="">Select Fit</option>
            {fitOptions.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <p className="mb-2">Color</p>
          <div className={`border rounded w-full max-h-60 overflow-y-auto bg-white ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
            <div
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-3 ${
                color === '' ? 'bg-gray-100' : ''
              }`}
              onClick={() => !loading && setColor('')}
            >
              <div className="w-6 h-6 rounded-full border border-gray-300 bg-white" />
              <span className="text-gray-600">Select Color</span>
            </div>

            {colorOptions.map((option) => (
              <ColorOption
                key={option}
                option={option}
                isSelected={color === option}
                bgColor={getColorFromName(option)}
                onClick={() => !loading && setColor(option)}
              />
            ))}
          </div>

          {color && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div
                className="w-6 h-6 rounded-full border border-gray-400"
                style={{ backgroundColor: getColorFromName(color) }}
              />
              <span>Selected: {color}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => !loading && setBestSeller((prev) => !prev)}
          disabled={loading}
        />
        <label className={`cursor-pointer ${loading ? 'opacity-60' : ''}`} htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      {/* Submit Button with Loader */}
      <button
        type="submit"
        disabled={loading}
        className={`w-28 py-3 mt-4 text-white rounded transition-colors flex items-center justify-center gap-2
          ${loading 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-black hover:bg-gray-800'
          }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Adding...</span>
          </>
        ) : (
          'ADD'
        )}
      </button>
    </form>
  );
};

export default Add;