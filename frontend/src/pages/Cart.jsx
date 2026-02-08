import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, getFinalPrice, formatPrice } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-2xl md:text-3xl mb-6">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="space-y-4">
        {cartData.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl">Your cart is empty</p>
            <button
              onClick={() => navigate('/collection')}
              className="mt-6 bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cartData.map((item) => {
            const product = products.find((p) => p._id === item._id);
            if (!product) return null;

            const finalPrice = getFinalPrice(product);
            const itemTotal = finalPrice * item.quantity;

            return (
              <div
                key={`${item._id}-${item.size}`}
                className="py-5 border-t border-b grid grid-cols-[1fr_auto_auto] sm:grid-cols-[3fr_1fr_1fr_auto] items-center gap-4 sm:gap-6 text-gray-700"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <img
                    className="w-16 sm:w-20 h-20 sm:h-24 object-cover rounded"
                    src={product.image[0]}
                    alt={product.name}
                  />
                  <div className="flex-1">
                    <p className="text-base sm:text-lg font-medium">{product.name}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                      <span className="font-medium">{formatPrice(finalPrice)}</span>
                      {product.discount > 0 && (
                        <span className="text-green-600 text-xs sm:text-sm">
                          {product.discount}% OFF
                        </span>
                      )}
                      <span className="px-3 py-1 bg-gray-100 text-xs rounded">
                        Size: {item.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="text-center sm:text-left">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1) {
                        updateQuantity(item._id, item.size, val);
                      }
                    }}
                    className="border border-gray-300 w-16 sm:w-20 text-center py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* Item Total */}
                <div className="text-right font-medium hidden sm:block">
                  {formatPrice(itemTotal)}
                </div>

                {/* Delete */}
                <button
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="text-gray-500 hover:text-red-600 transition p-2"
                  aria-label="Remove item"
                >
                  <img src={assets.bin_icon} alt="Remove" className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {cartData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-end mt-12 sm:mt-20">
          <div className="w-full sm:w-96 lg:w-[480px]">
            <CartTotal />
            <div className="text-right mt-8">
              <button
                onClick={() => navigate('/place-order')}
                className="bg-black text-white text-sm px-10 py-4 hover:bg-gray-900 transition"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;