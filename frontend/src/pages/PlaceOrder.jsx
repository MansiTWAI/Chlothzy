import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    try {
      const cartRes = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!cartRes.data.success) {
        toast.error(cartRes.data.message || "Cannot read your cart right now");
        return;
      }

      const serverCart = cartRes.data.cartData || {};
      const orderItems = [];

      for (const productId in serverCart) {
        const sizesObj = serverCart[productId];
        for (const size in sizesObj) {
          const quantity = sizesObj[size];
          if (quantity > 0) {
            const productInfo = products.find((p) => p._id === productId);
            if (productInfo) {
              const productImage = Array.isArray(productInfo.image)
                ? productInfo.image[0] || ""
                : productInfo.image || "";

              orderItems.push({
                productId: productInfo._id,
                name: productInfo.name,
                price: productInfo.price,
                quantity,
                size,
                image: productImage,
              });
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      const address = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipcode,
        country: formData.country,
      };

      const orderData = {
        items: orderItems,
        address,
        paymentMethod: method,
      };

      let response;

      switch (method) {
        case "cod":
          response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          break;

        case "stripe":
          response = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (response.data.success && response.data.session_url) {
            window.location.href = response.data.session_url;
            return;
          }
          break;

        case "razorpay":
          toast.info("Razorpay integration coming soon");
          return;

        default:
          toast.error("Invalid payment method selected");
          return;
      }

      if (response?.data?.success) {
        toast.success("Order placed successfully!");
        setCartItems({});
        navigate("/orders");
      } else {
        toast.error(response?.data?.message || "Order placement failed");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="bg-white">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-[1356px] mx-auto flex flex-col sm:flex-row justify-between gap-6 pt-8 sm:pt-12 pb-16 px-5 xl:px-0 border-t"
      >
        {/* Left – Delivery Information */}
        <div className="flex flex-col gap-3 w-full sm:max-w-[500px] ml-20">
          <div className="mb-2 text-2xl">
            <Title text1="DELIVERY" text2="INFORMATION" />
          </div>

          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              placeholder="First Name"
              className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              placeholder="Last Name"
              className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
            />
          </div>

          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            type="email"
            placeholder="Email Address"
            className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
          />

          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            placeholder="Street"
            className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
          />

          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              placeholder="City"
              className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
            />
            <input
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              placeholder="State"
              className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
            />
          </div>

          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              type="number"
              placeholder="Zip Code"
              className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
            />
            <input
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              placeholder="Country"
              className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
            />
          </div>

          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="tel"
            placeholder="Phone"
            className="border border-stone-300 rounded-sm py-2 px-4 w-full focus:border-[#8B4513] outline-none transition-all placeholder:text-stone-400"
          />
        </div>

        {/* Right – Cart Summary & Payment */}
        <div className="w-full sm:max-w-[450px] mr-20">
          <div className="mb-6">
            <CartTotal />
          </div>

          <div className="mt-8">
            <div className="mb-4">
              <Title text1="PAYMENT" text2="METHOD" />
            </div>

            <div className="flex gap-3 flex-col lg:flex-row w-full">
              {/* <div
                onClick={() => setMethod('stripe')}
                className={`flex items-center gap-3 border p-2.5 px-4 cursor-pointer transition-all duration-300 ${
                  method === 'stripe' ? 'border-[#8B4513] bg-stone-50' : 'border-stone-200'
                }`}
              >
                <div className={`min-w-[12px] h-[12px] border rounded-full flex items-center justify-center ${method === 'stripe' ? 'border-[#8B4513]' : 'border-stone-400'}`}>
                  {method === 'stripe' && <div className="w-1.5 h-1.5 bg-[#8B4513] rounded-full" />}
                </div>
                <img className="h-4" src={assets.stripe_logo} alt="Stripe" />
              </div> */}

              {/* Razorpay Option */}
              <div
                onClick={() => setMethod("razorpay")}
                className={`flex flex-1 items-center gap-3 border py-3 px-4 cursor-pointer transition-all duration-300 rounded-sm active:scale-95 ${
                  method === "razorpay"
                    ? "border-[#8B4513] bg-stone-50"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <div
                  className={`w-4 h-4 border rounded-full flex items-center justify-center transition-colors ${
                    method === "razorpay" ? "border-[#8B4513]" : "border-stone-300"
                  }`}
                >
                  {method === "razorpay" && (
                    <div className="w-2 h-2 bg-[#8B4513] rounded-full animate-pulse" />
                  )}
                </div>
                <img
                  className="h-4 w-auto object-contain"
                  src={assets.razorpay_logo}
                  alt="Razorpay"
                />
              </div>

              {/* Cash on Delivery Option */}
              <div
                onClick={() => setMethod("cod")}
                className={`flex flex-1 items-center gap-3 border py-3 px-4 cursor-pointer transition-all duration-300 rounded-sm active:scale-95 ${
                  method === "cod"
                    ? "border-[#8B4513] bg-[#8B4513]"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <div
                  className={`w-4 h-4 border rounded-full flex items-center justify-center transition-colors ${
                    method === "cod" ? "border-white" : "border-stone-300"
                  }`}
                >
                  {method === "cod" && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors ${
                    method === "cod" ? "text-white" : "text-stone-500"
                  }`}
                >
                  COD
                </p>
              </div>
            </div>

            <div className="w-full text-end mt-8">
              <button
                type="submit"
                className="bg-[#2D241E] text-white px-12 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#8B4513] transition-all duration-500 shadow-md active:translate-y-0.5"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;