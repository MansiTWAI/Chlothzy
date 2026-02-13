import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';

const TrackOrder = ({ order, onBack, currency }) => {
  // Define formatDate inside the component
  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Logic to handle Cancelled status separately for cleaner UI
  const isCancelled = order?.status === "Cancelled";
  const standardSteps = ["Order Placed", "Packing", "Shipped", "Out For Delivery", "Delivered"];
  const statusSteps = isCancelled ? ["Order Placed", "Cancelled"] : standardSteps;

  const [currentStepIndex, setCurrentStepIndex] = useState(
    Math.max(0, statusSteps.indexOf(order?.status || "Order Placed"))
  );

  useEffect(() => {
    const index = statusSteps.indexOf(order?.status || "Order Placed");
    setCurrentStepIndex(Math.max(0, index));
  }, [order?.status, statusSteps]);

  const progress = (currentStepIndex / (statusSteps.length - 1)) * 100;

  const copyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
      alert("Order ID copied to clipboard!");
    }
  };

  // Calculate line total (price × quantity)
  const lineTotal = (order?.displayPrice || 0) * (order?.quantity || 1);

  return (
    <div className="bg-[#faf7f5] min-h-screen p-4 sm:p-8 md:p-12 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 text-[#8B4513] font-semibold tracking-wide hover:opacity-80 transition-all"
          >
            <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            Back to Orders
          </button>
          
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            <span>Order History</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513]/30"></span>
            <span className="text-[#8B4513]">Live Tracking</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Product + Delivery Details Card */}
<div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
  {/* Product Aesthetic Card */}
  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-[#8B4513]/5 border border-[#8B4513]/5">
    {/* Product Header with Order ID */}
    <div className="p-6 pb-0 flex justify-between items-start">
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Reference</span>
        <div onClick={copyOrderId} className="flex items-center gap-2 cursor-pointer group">
          <p className="text-sm font-mono font-bold text-[#3d2b1f]">#{order?.orderId?.slice(-8) || 'N/A'}</p>
          <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCancelled ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-700'}`}>
        {order?.status}
      </span>
    </div>

    <div className="p-8">
      <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 shadow-sm bg-[#fdfaf8]">
        <img
          src={Array.isArray(order?.image) ? order.image[0] : order?.image || assets.parcel_icon}
          alt={order?.name}
          className="w-auto h-fit object-cover transform hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-[#3d2b1f] leading-tight italic">
          {order?.name || "Premium Selection"}
        </h2>
        
        <div className="flex items-baseline justify-between pt-2">
          <div className="flex items-end gap-2">
            <p className="text-[#8B4513] font-black text-3xl">
              {currency}{Number(order?.displayPrice || 0).toLocaleString('en-IN')}
            </p>
            <span className="text-gray-400 text-xs mb-1.5 font-medium">/ unit</span>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty</p>
             <p className="text-[#3d2b1f] font-bold text-lg">0{order?.quantity || 1}</p>
          </div>
        </div>

        {/* Pricing Summary Table */}
        <div className="bg-[#faf7f5] rounded-2xl p-4 space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-[#3d2b1f]">{currency}{lineTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="text-emerald-600 font-medium">Free</span>
          </div>
          <div className="h-[1px] bg-gray-200 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#3d2b1f]">Total Amount</span>
            <span className="text-xl font-black text-[#8B4513]">{currency}{lineTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Delivery Details Card */}
  <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-[#8B4513]/5 border border-[#8B4513]/5">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-[#8B4513]/5 rounded-xl flex items-center justify-center text-[#8B4513]">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </div>
      <h3 className="font-serif text-xl text-[#3d2b1f]">Shipping Destination</h3>
    </div>
    
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">Recipient</span>
        <span className="font-bold text-[#3d2b1f] text-lg">{order?.userName || '—'}</span>
        <span className="text-sm text-gray-500 mt-1 flex items-center gap-2">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
           {order?.userPhone || '—'}
        </span>
      </div>

      <div className="flex flex-col pt-4 border-t border-gray-50">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Delivery Address</span>
        <div className="bg-[#faf7f5]/50 p-4 rounded-2xl border border-gray-100">
          <p className="text-[#3d2b1f] text-sm leading-relaxed italic">
            {order?.fullAddress?.street},<br />
            {order?.fullAddress?.city}, {order?.fullAddress?.state}<br />
            <span className="font-bold not-italic">{order?.fullAddress?.pincode}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Method</span>
          <p className="text-sm font-bold text-[#3d2b1f] mt-1">{order?.paymentMethod || '—'}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Date</span>
          <p className="text-sm font-bold text-[#3d2b1f] mt-1">{formatDate(order?.date)}</p>
        </div>
      </div>
    </div>
  </div>
</div>

          {/* Right: Journey Timeline */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-[#8B4513]/5 border border-[#8B4513]/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h3 className="font-serif text-3xl text-[#3d2b1f] mb-2">Delivery Journey</h3>
                  <p className="text-gray-400 text-sm font-medium">Real-time status of your package</p>
                </div>
                <div className="bg-[#faf7f5] px-6 py-4 rounded-2xl border border-[#8B4513]/10">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivered by</p>
                  <p className="text-[#8B4513] font-bold">{order?.estimatedDelivery || 'Processing'}</p>
                </div>
              </div>

              <div className="relative">
                {/* Visual Progress Track */}
                <div className="absolute left-[19px] md:left-[23px] top-2 bottom-2 w-[3px] bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`w-full transition-all duration-1000 ease-in-out ${isCancelled ? 'bg-rose-400' : 'bg-[#8B4513]'}`}
                    style={{ height: `${progress}%` }}
                  />
                </div>

                <div className="space-y-12">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isActive = index === currentStepIndex;
                    
                    return (
                      <div key={step} className="relative flex items-start gap-8 group">
                        {/* Dot Indicator */}
                        <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                          isCompleted 
                            ? (isCancelled ? 'bg-rose-500 text-white' : 'bg-[#8B4513] text-white rotate-3 group-hover:rotate-0') 
                            : 'bg-white border-2 border-gray-100 text-gray-300'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-black">{index + 1}</span>
                          )}
                          {isActive && !isCancelled && (
                            <div className="absolute inset-0 rounded-2xl bg-[#8B4513] animate-ping opacity-20"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1 md:pt-2">
                          <div className="flex items-center gap-3 mb-1">
                            <p className={`text-lg font-bold tracking-tight uppercase ${isCompleted ? 'text-[#3d2b1f]' : 'text-gray-300'}`}>
                              {step}
                            </p>
                            {isActive && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${isCancelled ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                {isCancelled ? 'Final Status' : 'Current Stage'}
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-sm leading-relaxed max-w-md ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                            {step === "Order Placed" && "Your request has been validated and logged into our system."}
                            {step === "Packing" && "Our artisans are carefully prepping your item for the journey."}
                            {step === "Shipped" && "Package is on the move! Handed over to our global logistics partner."}
                            {step === "Out for Delivery" && "Local courier has your parcel. It should be with you shortly."}
                            {step === "Delivered" && "Successfully received. We hope you enjoy your new purchase!"}
                            {step === "Cancelled" && "This order was cancelled. Please contact us for further details."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Aesthetic Support Footer */}
              <div className="mt-16 p-8 bg-[#fdfaf8] rounded-[2rem] border border-[#8B4513]/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#8B4513]">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="font-serif text-xl text-[#3d2b1f]">Assistance needed?</p>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Our concierge team is available 24 hours a day.</p>
                  </div>
                </div>
                <button className="w-full md:w-auto px-10 py-4 bg-[#3d2b1f] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#3d2b1f]/20 hover:-translate-y-1 transition-all active:scale-95">
                  Concierge Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;