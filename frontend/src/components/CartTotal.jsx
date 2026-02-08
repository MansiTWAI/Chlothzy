import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { 
    currency, 
    delivery_fee, 
    cartItems, 
    products, 
    getFinalPrice, 
    getSavingsAmount 
  } = useContext(ShopContext);

  // Calculate MRP total
  let totalMRP = 0;
  let totalDiscount = 0;
  let totalFinal = 0;

  for (const itemId in cartItems) {
    const product = products.find(p => p._id === itemId);
    if (!product) continue;

    const finalPrice = getFinalPrice(product);
    const savings = getSavingsAmount(product);

    for (const size in cartItems[itemId]) {
      const qty = cartItems[itemId][size];
      totalMRP += product.price * qty;
      totalDiscount += savings * qty;
      totalFinal += finalPrice * qty;
    }
  }

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Total (MRP)</p>
          <p>{currency}{totalMRP.toLocaleString()}</p>
        </div>

        <div className="flex justify-between text-green-600">
          <p>Discount on MRP</p>
          <p>-{currency}{totalDiscount.toLocaleString()}</p>
        </div>

        <hr />

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>{currency}{delivery_fee}</p>
        </div>

        <hr />

        <div className="flex justify-between font-bold">
          <p>Total Amount</p>
          <p>
            {currency}{totalFinal === 0 ? 0 : (totalFinal + delivery_fee).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
