import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import TrackOrder from '../components/TrackOrder';
import { assets } from '../assets/assets';

const Orders = () => {
  const {
    backendUrl,
    token,
    currency,
    navigate,
    handleCancelOrder,
    canUserEditOrder,
    updateMyOrder,
  } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingItem, setTrackingItem] = useState(null);
  const [filter, setFilter] = useState('All');

  // Modal States (cancellation)
  const [showCancelCard, setShowCancelCard] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Edit mode states
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: { street: '', city: '', state: '', pincode: '' },
  });

  const loadOrderData = async (silent = false) => {
    if (!token) {
      toast.warning("Please login to view orders");
      setLoading(false);
      return;
    }
    try {
      if (!silent) setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const allItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allItems.push({
              ...item,
              status: order.status,
              paymentMethod: order.paymentMethod || '—',
              estimatedDelivery: order.estimatedDelivery || 'Processing',
              date: order.date,
              orderId: order._id,
              displayPrice: item.finalPrice ?? item.price,
              userName: order.address?.name || '',
              userPhone: order.address?.phone || '',
              fullAddress: order.address || {},
            });
          });
        });
        allItems.sort((a, b) => b.date - a.date);
        setOrderData(allItems);
      } else {
        toast.error(response.data.message || "No orders found");
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      if (!silent) toast.error("Could not load orders");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
    const interval = setInterval(() => { loadOrderData(true); }, 15000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (trackingItem) {
      const updatedItem = orderData.find(
        item => item.orderId === trackingItem.orderId && item.productId === trackingItem.productId
      );
      if (updatedItem) setTrackingItem(updatedItem);
    }
  }, [orderData]);

  const filteredData = orderData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !['Delivered', 'Cancelled'].includes(item.status);
    return item.status === filter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  // Cancellation Handlers
  const openCancelModal = (orderId) => {
    setSelectedOrder(orderId);
    setShowCancelCard(true);
  };

  const confirmCancel = () => {
    handleCancelOrder(selectedOrder, loadOrderData);
    setShowCancelCard(false);
  };

  // ── Edit Handlers ───────────────────────────────────────────────────────
  const startEdit = (item) => {
    setEditingOrderId(item.orderId);
    setEditForm({
      name: item.userName || '',
      phone: item.userPhone || '',
      address: { ...item.fullAddress } || { street: '', city: '', state: '', pincode: '' },
      // Store current item being edited for quantity/size
      editingItem: { ...item }
    });
  };

  const cancelEdit = () => {
    setEditingOrderId(null);
    setEditForm({ name: '', phone: '', address: {}, editingItem: null });
  };

  const handleFormChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addrField = field.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        address: { ...prev.address, [addrField]: value },
      }));
    } else if (field === 'quantity' || field === 'size') {
      setEditForm(prev => ({
        ...prev,
        editingItem: { ...prev.editingItem, [field]: value }
      }));
    } else {
      setEditForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const saveOrderChanges = async (item) => {
    const updates = {
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      address: {
        street: editForm.address.street?.trim() || '',
        city: editForm.address.city?.trim() || '',
        state: editForm.address.state?.trim() || '',
        pincode: editForm.address.pincode?.trim() || '',
      },
      items: [{
        productId: item.productId,
        quantity: editForm.editingItem?.quantity || item.quantity,
        size: editForm.editingItem?.size || item.size,
      }],
    };

    const result = await updateMyOrder(item.orderId, updates, item.status);

    if (result.success) {
      cancelEdit();
      loadOrderData(true); // refresh list
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#8B4513]/20 border-t-[#8B4513] rounded-full animate-spin"></div>
        <p className="text-[#8B4513] mt-4 font-medium animate-pulse">Fetching your orders...</p>
      </div>
    );
  }

  if (trackingItem) {
    return (
      <TrackOrder
        order={trackingItem}
        currency={currency}
        onBack={() => {
          setTrackingItem(null);
          loadOrderData(true);
        }}
      />
    );
  }

  return (
    <div className="bg-[#faf7f5] min-h-screen pb-20 relative">

      {/* CANCELLATION CARD UI */}
      {showCancelCard && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-6">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowCancelCard(false)}
          ></div>

          <div className="relative bg-white p-8 sm:p-10 rounded-[1.5rem] shadow-2xl max-w-sm w-full text-center border border-stone-100 transform transition-all animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowCancelCard(false)}
              className="absolute top-4 right-4 p-2 text-stone-300 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative z-10 pt-2">
              <div className="mb-6 flex justify-center">
                <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                  <svg className="w-6 h-6 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-stone-800 mb-2">
                Cancel Order
              </h2>
              
              <p className="text-stone-500 text-sm leading-relaxed mb-8 px-2">
                Are you sure you want to cancel this item? This action cannot be undone.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmCancel} 
                  className="w-full bg-[#8B4513] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F370F] transition-all active:scale-[0.98] shadow-md shadow-[#8B4513]/20"
                >
                  Confirm Cancellation
                </button>
                
                <button 
                  onClick={() => setShowCancelCard(false)} 
                  className="w-full bg-transparent text-stone-400 py-2 rounded-xl text-xs font-medium hover:text-stone-600 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="text-2xl">
            <Title text1="MY" text2="ORDERS" />
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-[#8B4513]/10 shadow-sm overflow-x-auto no-scrollbar">
            {['All', 'Active', 'Delivered', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  filter === tab 
                  ? 'bg-[#8B4513] text-white shadow-md shadow-[#8B4513]/20' 
                  : 'text-gray-400 hover:text-[#8B4513]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#8B4513]/20 shadow-sm">
            <div className="bg-[#faf7f5] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B4513]/30">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-xl font-serif text-[#3d2b1f]">No {filter !== 'All' ? filter.toLowerCase() : ''} orders found</p>
            <button onClick={() => navigate('/collection')} className="mt-6 bg-[#8B4513] text-white px-8 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((item, index) => {
              const isDelivered = item.status === 'Delivered';
              const isCancelled = item.status === 'Cancelled';
              const isEditable = canUserEditOrder(item.status);
              const isEditingThisOrder = editingOrderId === item.orderId;

              // Calculate current line price (used in both views)
              const linePrice = (item.displayPrice || 0) * (isEditingThisOrder ? (editForm.editingItem?.quantity || item.quantity) : item.quantity);

              return (
                <div
                  key={`${item.orderId}-${item.productId || index}`}
                  className={`relative overflow-hidden group border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                    isCancelled ? 'border-red-100 opacity-80' : 'border-[#8B4513]/5'
                  }`}
                >
                  <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-bold uppercase tracking-tighter rounded-bl-xl z-10 ${
                    isDelivered ? 'bg-emerald-50 text-emerald-600' :
                    isCancelled ? 'bg-rose-50 text-rose-500' :
                    'bg-[#8B4513]/10 text-[#8B4513]'
                  }`}>
                    {item.status}
                  </div>

                  <div className="w-full sm:w-32 h-40 sm:h-32 bg-[#faf7f5] rounded-xl overflow-hidden flex-shrink-0 border border-[#8B4513]/5">
                    <img
                      src={Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.name}
                      className="w-fit h-fit object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => (e.target.src = assets.parcel_icon || '')}
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-[#3d2b1f]">{item.name}</h4>

                    {isEditable && isEditingThisOrder ? (
                      <div className="mt-4 bg-stone-50 p-5 rounded-xl border border-[#8B4513]/10 space-y-5">
                        {/* Address edit */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Name</label>
                            <input
                              value={editForm.name}
                              onChange={(e) => handleFormChange('name', e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm"
                              placeholder="Full name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Phone</label>
                            <input
                              value={editForm.phone}
                              onChange={(e) => handleFormChange('phone', e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm"
                              placeholder="Phone number"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs text-gray-600 mb-1">Street</label>
                            <input
                              value={editForm.address.street || ''}
                              onChange={(e) => handleFormChange('address.street', e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm"
                              placeholder="Street address"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">City</label>
                            <input
                              value={editForm.address.city || ''}
                              onChange={(e) => handleFormChange('address.city', e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Pincode</label>
                            <input
                              value={editForm.address.pincode || ''}
                              onChange={(e) => handleFormChange('address.pincode', e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm"
                              placeholder="Pincode"
                            />
                          </div>
                        </div>

                        {/* Quantity & Size + Price */}
                        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Size</label>
                            <select
                              value={editForm.editingItem?.size || item.size || ''}
                              onChange={(e) => handleFormChange('size', e.target.value)}
                              className="p-2 border rounded-lg text-sm min-w-[100px]"
                            >
                              <option value="">Select</option>
                              <option>S</option>
                              <option>M</option>
                              <option>L</option>
                              <option>XL</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Qty</label>
                            <input
                              type="number"
                              min="1"
                              value={editForm.editingItem?.quantity || item.quantity}
                              onChange={(e) => handleFormChange('quantity', e.target.value)}
                              className="w-20 p-2 border rounded-lg text-sm text-center"
                            />
                          </div>

                          <div className="text-sm text-gray-600">
                            <div>Price per unit: {currency}{Number(item.displayPrice).toLocaleString('en-IN')}</div>
                            <div className="font-bold text-[#8B4513]">
                              Total: {currency}{Number((editForm.editingItem?.quantity || item.quantity) * item.displayPrice).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        {/* Save/Cancel */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => saveOrderChanges(item)}
                            className="bg-[#8B4513] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#6d3610] transition"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Normal view – show price × quantity
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#8B4513]">
                            {currency}{Number(item.displayPrice).toLocaleString('en-IN')}
                          </span>
                          <span className="text-gray-400 text-sm">× {item.quantity}</span>
                        </div>
                        <div className="text-sm font-medium text-[#8B4513]">
                          Total: {currency}{Number(item.displayPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                        <div className="text-gray-400 text-sm">Size: {item.size || '—'}</div>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-10 text-xs text-gray-500">
                      <p><span className="font-semibold text-gray-400 mr-2 uppercase tracking-tighter">Ordered:</span>{formatDate(item.date)}</p>
                      <p><span className="font-semibold text-gray-400 mr-2 uppercase tracking-tighter">Delivery:</span>{item.estimatedDelivery}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-3 sm:min-w-[160px]">
                    <button
                      onClick={() => setTrackingItem(item)}
                      className="w-full bg-white border border-[#8B4513]/20 text-[#8B4513] py-2.5 rounded-xl text-xs font-bold hover:bg-[#8B4513] hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      Track Order
                    </button>

                    {canUserEditOrder(item.status) && !isEditingThisOrder && (
                      <button
                        onClick={() => startEdit(item)}
                        className="w-full bg-[#8B4513]/10 text-[#8B4513] py-2.5 rounded-xl text-xs font-bold hover:bg-[#8B4513]/20 transition-all active:scale-95"
                      >
                        Edit Order
                      </button>
                    )}

                    {!isDelivered && !isCancelled && canUserEditOrder(item.status) && (
                      <button
                        onClick={() => openCancelModal(item.orderId)}
                        className="w-full bg-rose-50 text-rose-500 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                      >
                        Cancel Item
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;