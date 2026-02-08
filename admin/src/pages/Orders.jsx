import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { Search, Filter, Package, Calendar, User, Phone, MapPin, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(new Set());
  const [pendingChanges, setPendingChanges] = useState({});

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllOrders = async () => {
    if (!token) {
      toast.error("Admin authentication required");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders || []);
        setFilteredOrders(response.data.orders || []);
        setPendingChanges({});
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Admin orders fetch error:", error);
      toast.error(error?.response?.data?.message || "Network error – try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...orders];
    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(order => {
        const name = `${order.address?.name || ''}`.toLowerCase();
        const phone = `${order.address?.phone || ''}`.toLowerCase();
        const id = order._id.toLowerCase();
        return name.includes(q) || phone.includes(q) || id.includes(q);
      });
    }
    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const queueChange = (orderId, field, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const confirmChanges = async (orderId) => {
    const changes = pendingChanges[orderId];
    if (!changes) return;

    const key = `${orderId}-confirm`;
    setUpdating(prev => new Set([...prev, key]));

    try {
      const payload = { orderId };
      if (changes.status !== undefined) payload.status = changes.status;
      if (changes.expectedDelivery !== undefined) {
        let sendValue = changes.expectedDelivery;
        if (sendValue) {
          try {
            const d = new Date(sendValue);
            if (!isNaN(d.getTime())) {
              sendValue = d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
            }
          } catch {}
        }
        if (!sendValue?.trim()) sendValue = null;
        payload.expectedDelivery = sendValue;
      }

      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        payload,
        { headers: { token } }
      );

      if (!res.data.success) throw new Error(res.data.message || "Update failed");

      toast.success("Changes confirmed successfully");

      setOrders(prev =>
        prev.map(o =>
          o._id === orderId
            ? {
                ...o,
                status: changes.status !== undefined ? changes.status : o.status,
                expectedDelivery: changes.expectedDelivery !== undefined ? payload.expectedDelivery : o.expectedDelivery
              }
            : o
        )
      );

      setPendingChanges(prev => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    } catch (err) {
      console.error("Confirm changes failed:", err);
      toast.error(err?.response?.data?.message || "Could not confirm changes");
      fetchAllOrders();
    } finally {
      setUpdating(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleStatusChange = (e, orderId) => {
    const value = e.target.value;
    queueChange(orderId, 'status', value);
    setOrders(prev =>
      prev.map(o => (o._id === orderId ? { ...o, status: value } : o))
    );
  };

  const handleDeliveryChange = (e, orderId) => {
    const value = e.target.value;
    queueChange(orderId, 'expectedDelivery', value);
    let displayValue = value;
    if (value) {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          displayValue = d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
        }
      } catch {}
    }
    setOrders(prev =>
      prev.map(o => (o._id === orderId ? { ...o, expectedDelivery: displayValue || '' } : o))
    );
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr || dateStr === 'Processing') return 'TBD';
    if (/^\d{1,2}\s[A-Za-z]{3}\s\d{4}$/.test(dateStr)) return dateStr;
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr || 'TBD';
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-800"></div>
        <p className="text-stone-500 font-medium animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 min-h-screen bg-[#FDFDFD] text-[#2D241E]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight">Orders</h3>
            <p className="text-stone-500 text-sm md:text-base">Manage and track your boutique's fulfillment flow.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="text"
                placeholder="Search by ID, Name or Phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-100 transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 pl-4 pr-10 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-100 appearance-none cursor-pointer shadow-sm font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm">
            <Package className="text-stone-200 mx-auto mb-4" size={64} strokeWidth={1} />
            <p className="text-xl text-stone-800 font-medium">No orders found</p>
            <p className="text-stone-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map(order => {
              const isUpdating = updating.has(`${order._id}-confirm`);
              const hasPending = !!pendingChanges[order._id];
              const isFinal = ["Delivered", "Cancelled"].includes(order.status);

              return (
                <div
                  key={order._id}
                  className={`group relative flex flex-col lg:grid lg:grid-cols-[220px_1fr_1fr_200px] gap-6 md:gap-8 border rounded-3xl p-5 md:p-7 transition-all duration-300 ${
                    isFinal ? 'bg-stone-50 border-stone-100' : 'bg-white border-stone-200 hover:shadow-xl hover:shadow-stone-200/30 hover:border-stone-300'
                  }`}
                >
                  {/* ID Tag */}
                  <div className="absolute top-4 right-6 text-[10px] font-bold text-stone-300 tracking-tighter">
                    #{order._id.slice(-6).toUpperCase()}
                  </div>

                  {/* Col 1: Visuals & Items */}
                  <div className="flex flex-col gap-4">
                    <div className="flex -space-x-3">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-14 h-18 md:w-16 md:h-20 rounded-xl border-2 border-white overflow-hidden bg-stone-100 shadow-sm flex-shrink-0">
                          <img
                            src={(typeof item.image === 'string' && item.image.trim()) ? item.image : assets.parcel_icon}
                            className="w-full h-full object-cover"
                            alt="product"
                          />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-14 h-18 md:w-16 md:h-20 rounded-xl border-2 border-white bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-bold shadow-sm">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Order Summary</p>
                      <div className="max-h-24 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-stone-600 truncate max-w-[120px]">{item.name}</span>
                            <span className="text-stone-400 font-medium">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Customer Details */}
                  <div className="flex flex-col justify-center space-y-4 py-2 border-t lg:border-t-0 lg:border-l border-stone-100 lg:pl-8">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-stone-100 rounded-lg text-stone-500"><User size={16} /></div>
                      <div>
                        <p className="font-bold text-stone-800">{order.address?.name || 'Customer'}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{order.address?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-stone-500">
                      <div className="p-2 bg-stone-100 rounded-lg text-stone-500"><MapPin size={16} /></div>
                      <p className="text-xs leading-relaxed max-w-[200px]">
                        {order.address?.street}, {order.address?.city}, {order.address?.state}
                      </p>
                    </div>
                  </div>

                  {/* Col 3: Delivery & Payment */}
                  <div className="flex flex-col justify-center space-y-5 py-2 border-t lg:border-t-0 lg:border-l border-stone-100 lg:pl-8">
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                        <Clock size={14} className="text-stone-400" />
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Est. Delivery</span>
                      </div>
                      <p className="text-sm font-bold text-stone-700">
                        {formatDisplayDate(order.expectedDelivery)}
                      </p>
                      {!isFinal && (
                        <input
                          type="date"
                          onChange={e => handleDeliveryChange(e, order._id)}
                          className="mt-2 w-full text-[11px] bg-stone-50 border border-stone-100 rounded-md p-1 focus:outline-none focus:border-stone-300"
                        />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Total Amount</span>
                      <p className="text-2xl font-serif font-bold text-[#8B4513]">
                        {currency}{Number(order.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Col 4: Status & Actions */}
                  <div className="flex flex-col justify-center gap-3 py-2 border-t lg:border-t-0 lg:border-l border-stone-100 lg:pl-8">
                    <div className="relative">
                      <select
                        value={order.status || "Order Placed"}
                        onChange={e => handleStatusChange(e, order._id)}
                        disabled={isFinal || isUpdating}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-bold appearance-none transition-all shadow-sm border ${
                          order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          order.status === "Cancelled" ? "bg-rose-50 text-rose-700 border-rose-100" :
                          "bg-white text-stone-700 border-stone-200"
                        } ${isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out For Delivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      {!isFinal && <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 rotate-90" />}
                    </div>

                    {hasPending && !isFinal && (
                      <button
                        onClick={() => confirmChanges(order._id)}
                        disabled={isUpdating}
                        className="w-full py-3 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isUpdating ? (
                          <div className="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></div>
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        Confirm Update
                      </button>
                    )}

                    {isFinal && (
                      <div className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-100 rounded-lg border border-stone-200">
                         Completed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Orders;