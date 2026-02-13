import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import {
  Search,
  Filter,
  Package,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Truck,
  ShoppingBag,
  XCircle,
  Edit3,
  X,
  CheckSquare,
  Check,
} from "lucide-react";

// ─── canEditOrder (admin-only version) ──────────────────────────────
const canEditOrder = (status) => {
  const adminEditable = [
    "Order Placed",
    "Confirmed",
    "Packing",
    // "Shipped",
    // "Out For Delivery",
  ];
  return adminEditable.includes(status);
};

// ─── Memoized Order Item ────────────────────────────────────────

const OrderItem = memo(({ 
  item, 
  orderId,              
  backendUrl,           
  fetchOrder, 
  currency = "₹",
  status
}) => {
  const mrp = Number(item.price || 0);
  const price = Number(item.finalPrice ?? mrp);
  const saved = mrp - price;
  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const [size, setSize] = useState(item.size || "");
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditable = canEditOrder(status);

const handleSave = async () => {
  // Early validation
  if (!backendUrl) {
    toast.error("Backend URL is not configured");
    console.error("backendUrl prop is missing or undefined");
    return;
  }

  if (!orderId) {
    toast.error("Order ID is missing");
    console.error("orderId prop is missing in OrderItem");
    return;
  }

  if (!item?.productId) {
    toast.error("Product ID not found for this item");
    console.error("item.productId is missing", item);
    return;
  }

  if (quantity < 1) {
    toast.error("Quantity must be at least 1");
    return;
  }
   if (!isEditable) {
    toast.warn(`Cannot edit items when order is "${status}"`);
    setLoading(false);
    return;
  }
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Authentication token not found. Please log in again.");
    console.warn("No token found in localStorage");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      orderId,
      items: [{
        productId: item.productId,
        quantity: Number(quantity),
        size: size || undefined,
      }]
    };

    console.log("→ Sending item update request", {
      url: `${backendUrl}/api/order/admin/update`,
      payload,
      tokenPreview: token.substring(0, 15) + "...",
      headersSent: ["Authorization (Bearer)", "token"]
    });

    const res = await axios.put(
      `${backendUrl}/api/order/admin/update`,
      payload,
      {
        headers: {
          // Most common modern format
          Authorization: `Bearer ${token}`,
          // Many Indian/educational projects use this custom header instead
          token: token
        }
      }
    );

    if (res.data.success) {
      toast.success("Item updated successfully");
      setIsEditing(false);
      fetchOrder?.(); // refresh the order list
    } else {
      toast.error(res.data.message || "Update failed");
      console.warn("Backend responded with:", res.data);
    }
  } catch (err) {
    console.error("Item update failed:", err);

    let errorMessage = "Could not update item. Please try again.";

    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.response?.status === 401 || err?.response?.status === 403) {
      errorMessage = "Authentication issue – please log out and log in again";
    } else if (err?.response?.status === 404) {
      errorMessage = "Order or item not found on server";
    } else if (err?.response?.status === 400) {
      errorMessage = "Invalid request data";
    }

    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};
  const handleCancel = () => {
    setIsEditing(false);
    setSize(item.size || "");
    setQuantity(item.quantity || 1);
  };

  return (
    <div className="group flex gap-6 py-5 border-b border-stone-100 last:border-0 last:pb-0 hover:bg-stone-50/40 transition-all duration-300 rounded-2xl p-4 -mx-4 relative">
      {/* Edit Icon */}
     {/* Edit Icon – only show when status allows editing */}
{!isEditing && !loading && isEditable && (
  <Edit3
    size={14}
    className="absolute top-2 right-2 cursor-pointer text-stone-400 hover:text-stone-600"
    onClick={() => setIsEditing(true)}
  />
)}

{/* Show hint when editing is not allowed */}
{!isEditing && !loading && !isEditable && (
  <span className="absolute top-2 right-4 text-xs text-stone-400 italic">
    Your order is {status}
  </span>
)}

      {/* Product Image */}
      <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 flex-shrink-0 shadow-sm relative">
        <img
          src={item.image}
          alt={item.name || "Product"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = "/assets/parcel_icon.png"; }}
        />
        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="mb-auto">
          <h4 className="font-bold text-stone-900 line-clamp-1 text-lg group-hover:text-[#8B4513] transition-colors">
            {item.name || "Unnamed product"}
          </h4>
          <p className="text-[11px] font-mono text-stone-400 mt-1 uppercase tracking-wider">
            REF: {String(item.productId || "—").slice(-12)}
          </p>
        </div>

        {/* Size & Quantity */}
        <div className="flex flex-wrap gap-2 my-4 items-center">
          {isEditing ? (
            <>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                disabled={loading}
                className="px-2.5 py-1 bg-white border border-stone-200 text-[10px] font-bold text-stone-900 uppercase rounded-lg"
              >
                {["S", "M", "L", "XL"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={loading}
                className="w-16 px-2 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase rounded-lg text-center"
              />

              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1 text-green-600 text-xs font-bold disabled:opacity-50"
              >
                <Check size={12} />
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-1 text-red-600 text-xs font-bold disabled:opacity-50"
              >
                <X size={12} /> Cancel
              </button>
            </>
          ) : (
            <>
              {size && (
                <span className="px-2.5 py-1 bg-white border border-stone-200 text-[10px] font-bold text-stone-600 uppercase rounded-lg">
                  Size: <span className="text-stone-900">{size}</span>
                </span>
              )}
              <span className="px-2.5 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase rounded-lg">
                Qty: {quantity}
              </span>
            </>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-bold text-2xl text-stone-900 tracking-tight">
              {currency}{price.toLocaleString()}
            </span>
            {mrp > price && (
              <span className="text-sm text-stone-400 line-through decoration-stone-300">
                {currency}{mrp.toLocaleString()}
              </span>
            )}
          </div>

          {mrp > price && (
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">
                {discountPercent}% OFF
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">
                Saved {currency}{saved.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});


// ─── Memoized Price Breakdown ───────────────────────────────────
const PriceBreakdown = memo(({ items = [], currency }) => {
  if (!items?.length) {
    return <p className="text-stone-400 text-sm">No items in this order.</p>;
  }

  const totals = useMemo(() => {
    let totalMRP = 0;
    let totalPaid = 0;

    items.forEach((item) => {
      const qty = Number(item.quantity || 1);
      const mrp = Number(item.price || 0);
      const discounted = Number(item.finalPrice ?? mrp);
      totalMRP += mrp * qty;
      totalPaid += discounted * qty;
    });

    return {
      totalMRP,
      totalPaid,
      totalSavings: totalMRP - totalPaid,
    };
  }, [items]);

  return (
    <>
      <div className="space-y-4 text-sm">
        {items.map((item, i) => {
          const mrp = Number(item.price || 0);
          const discounted = Number(item.finalPrice ?? mrp);
          const qty = Number(item.quantity || 1);
          const lineMRP = mrp * qty;
          const linePaid = discounted * qty;
          const savings = lineMRP - linePaid;
          const discountPercent =
            mrp > discounted ? Math.round(((mrp - discounted) / mrp) * 100) : 0;

          return (
            <div
              key={i}
              className="space-y-1 pb-3 border-b border-stone-100 last:border-0 last:pb-0"
            >
              <div className="font-medium text-stone-800 truncate">
                {item.name} × {qty}
              </div>

              <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 text-stone-600 text-right">
                <div className="text-left text-xs text-stone-500">
                  MRP
                  <br />
                  <span className="font-normal text-stone-600">
                    {currency}
                    {mrp.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  After Discount
                  <br />
                  <span className="font-medium text-[#8B4513]">
                    {currency}
                    {discounted.toLocaleString()}
                  </span>
                  {discountPercent > 0 && (
                    <span className="ml-1 text-xs font-medium text-green-600">
                      ({discountPercent}% off)
                    </span>
                  )}
                </div>
                {/* <div className="font-medium text-stone-800">
                  {currency}{linePaid.toLocaleString()}
                </div> */}
              </div>

              {savings > 0 && (
                <div className="text-xs text-green-700 mt-1">
                  Customer saved{" "}
                  <strong>
                    {currency}
                    {savings.toLocaleString()}
                  </strong>{" "}
                  on this item
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-4 mt-2 border-t border-stone-200 space-y-2 text-sm">
        {totals.totalSavings > 0 && (
          <div className="flex justify-between items-center text-green-700 font-medium">
            <span>Total Savings</span>
            <span>
              {currency}
              {totals.totalSavings.toLocaleString()}
            </span>
          </div>
        )}
        {/* <div className="flex justify-between items-center text-base font-semibold text-[#8B4513] pt-2">
          <span>Total Amount Paid</span>
          <span>{currency}{totals.totalPaid.toLocaleString()}</span>
        </div> */}
      </div>
    </>
  );
});

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(new Set());
  const [pendingChanges, setPendingChanges] = useState({});

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // ─── Fetch ──────────────────────────────────────────────────────
  const fetchAllOrders = useCallback(async () => {
    if (!token) {
      toast.error("Admin authentication required");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } },
      );

      if (data.success) {
        const sorted = [...(data.orders || [])].sort(
          (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
        );
        setOrders(sorted);
        setPendingChanges({});
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // ─── Filtering (most important memo) ────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter !== "All") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((o) => {
        const name = (o.address?.name || "").toLowerCase();
        const phone = (o.address?.phone || "").toLowerCase();
        const id = o._id?.toLowerCase() || "";
        return name.includes(q) || phone.includes(q) || id.includes(q);
      });
    }

    return result;
  }, [orders, statusFilter, searchTerm]);
  // ─── Customer Editing Handlers ───────────────────────────────

  // Start editing customer info for a specific order
  const startCustomerEdit = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? {
              ...o,
              isEditingCustomer: true, // toggle edit mode
              editCustomerData: { ...o.address }, // clone current address
            }
          : o,
      ),
    );
  };

  // Handle input change while editing
  const handleCustomerChange = (orderId, field, value) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? {
              ...o,
              editCustomerData: {
                ...o.editCustomerData,
                [field]: value,
              },
            }
          : o,
      ),
    );
  };

  // Confirm & save changes
  const confirmCustomerEdit = async (orderId, isAdmin = false) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order?.editCustomerData) return;

    try {
      const payload = {
        orderId,
        name: order.editCustomerData.name,
        phone: order.editCustomerData.phone,
        address: {
          street: order.editCustomerData.street,
          city: order.editCustomerData.city,
          state: order.editCustomerData.state,
          pincode: order.editCustomerData.pincode,
        },
      };

      const url = isAdmin
        ? `${backendUrl}/api/order/admin/update`
        : `${backendUrl}/api/order/update`;

      const { data } = await axios.put(url, payload, { headers: { token } });
      if (!data.success) throw new Error(data.message);

      // Update state locally
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                address: {
                  ...payload.address,
                  name: payload.name,
                  phone: payload.phone,
                },
                isEditingCustomer: false,
                editCustomerData: null,
              }
            : o,
        ),
      );

      toast.success("Customer info updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  // Cancel editing without saving
  const cancelCustomerEdit = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, isEditingCustomer: false, editCustomerData: null }
          : o,
      ),
    );
  };

  // ─── Change handlers ────────────────────────────────────────────
  const queueChange = useCallback((orderId, field, value) => {
    setPendingChanges((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  }, []);

  const confirmChanges = useCallback(
    async (orderId) => {
      const changes = pendingChanges[orderId];
      if (!changes) return;

      const key = `${orderId}-confirm`;
      setUpdating((prev) => new Set([...prev, key]));

      try {
        const payload = { orderId };
        if (changes.status) payload.status = changes.status;

        if (changes.estimatedDelivery !== undefined) {
          let val = changes.estimatedDelivery?.trim();
          if (val) {
            const d = new Date(val);
            if (!isNaN(d.getTime())) {
              val = d.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
            }
          }
          payload.estimatedDelivery = val || null;
        }

        const { data } = await axios.post(
          `${backendUrl}/api/order/status`,
          payload,
          { headers: { token } },
        );

        if (!data.success) throw new Error(data.message);

        toast.success("Order updated");

        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                  ...o,
                  ...changes,
                  estimatedDelivery:
                    payload.estimatedDelivery ?? o.estimatedDelivery,
                }
              : o,
          ),
        );

        setPendingChanges((prev) => {
          const next = { ...prev };
          delete next[orderId];
          return next;
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Update failed");
        fetchAllOrders();
      } finally {
        setUpdating((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [pendingChanges, token, fetchAllOrders],
  );

  const handleStatusChange = useCallback(
    (e, orderId) => {
      const value = e.target.value;

      if (value === "Delivered" || value === "Cancelled") {
        const msg =
          value === "Delivered"
            ? "Mark as DELIVERED? This cannot be undone."
            : "CANCEL this order? This cannot be undone.";
        if (!window.confirm(msg)) return;
      }

      queueChange(orderId, "status", value);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: value } : o)),
      );
    },
    [queueChange],
  );

  const handleDeliveryChange = useCallback(
    (e, orderId) => {
      const value = e.target.value;
      queueChange(orderId, "estimatedDelivery", value);

      let display = "Not set";
      if (value) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          display = d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        }
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, estimatedDelivery: display } : o,
        ),
      );
    },
    [queueChange],
  );

  // ─── Format helpers (memoized) ──────────────────────────────────
  const formatDisplayDate = useCallback((dateStr) => {
    if (!dateStr) return "Not set";
    if (/^\d{1,2}\s[A-Za-z]{3}\s\d{4}$/.test(dateStr)) return dateStr;

    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  }, []);

  const getDateInputValue = useCallback((dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  }, []);

  const getStatusBadge = useCallback((status) => {
    const styles = {
      "Order Placed": "bg-amber-50 text-amber-700 border-amber-200",
      Packing: "bg-blue-50 text-blue-700 border-blue-200",
      Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Out For Delivery": "bg-cyan-50 text-cyan-700 border-cyan-200",
      Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    };

    const icons = {
      "Order Placed": <ShoppingBag size={14} />,
      Packing: <Package size={14} />,
      Shipped: <Truck size={14} />,
      "Out For Delivery": <Truck size={14} />,
      Delivered: <CheckCircle2 size={14} />,
      Cancelled: <XCircle size={14} />,
    };

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${styles[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
      >
        {icons[status]}
        {status}
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
          <p className="text-stone-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-b from-[#FDFAF8] to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#2D241E] tracking-tight">
              Orders
            </h1>
            <p className="text-stone-500 mt-2">
              Manage & track boutique fulfillment
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[280px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Search order ID, name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 transition-all shadow-sm"
              />
            </div>

            <div className="relative min-w-[200px]">
              <Filter
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                size={16}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-stone-200 rounded-2xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 shadow-sm font-medium cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-12 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-stone-50 flex items-center justify-center mb-6">
              <Package size={48} className="text-stone-300" strokeWidth={1.2} />
            </div>
            <h3 className="text-2xl font-medium text-stone-800 mb-3">
              No orders found
            </h3>
            <p className="text-stone-500 max-w-md mx-auto">
              Try adjusting your search or filter settings
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isUpdating = updating.has(`${order._id}-confirm`);
              const hasPending = !!pendingChanges[order._id];
              const isFinal =
                order.status === "Delivered" || order.status === "Cancelled";
                const canEditThisOrder = canEditOrder(order.status);

              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-[2rem] border overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                    isFinal ? "opacity-90 bg-stone-50/40" : "bg-white"
                  } ${hasPending ? "ring-2 ring-[#8B4513] shadow-lg border-transparent" : "border-stone-200/60"}`}
                >
                  {/* Header: High Contrast & Integrated Actions */}
                  <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                          Order Reference
                        </span>
                        <span className="font-mono text-sm font-bold text-stone-700">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="h-8 w-[1px] bg-stone-200 mx-2 hidden md:block" />
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {!isFinal && (
                        <div className="relative group">
                          <select
                            value={order.status || "Order Placed"}
                            onChange={(e) => handleStatusChange(e, order._id)}
                            disabled={isUpdating}
                            className="appearance-none bg-white border border-stone-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 cursor-pointer disabled:opacity-50 transition-all hover:border-stone-300"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Packing">Packing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out For Delivery">
                              Out For Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronRight
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 rotate-90 pointer-events-none"
                            size={14}
                          />
                        </div>
                      )}

                      {hasPending && (
                        <button
                          onClick={() => confirmChanges(order._id)}
                          disabled={isUpdating}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                            isUpdating
                              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                              : "bg-[#8B4513] text-white shadow-md hover:bg-[#6d3610]"
                          }`}
                        >
                          {isUpdating ? (
                            <div className="animate-spin h-3.5 w-3.5 border-2 border-stone-300 border-t-stone-600 rounded-full" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          Update Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left Column: Product List */}
                    <div className="lg:col-span-7 p-6 lg:p-8 border-r border-stone-50">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">
                          Shipment Contents
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                          {order.items?.length} items
                        </span>
                      </div>

                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
  {order.items?.map((item, idx) => (
    <OrderItem
      key={item._id || idx}
      item={item}
      orderId={order._id}
      backendUrl={backendUrl}
      fetchOrder={fetchAllOrders}
      currency={currency}
      status={order.status}
    />
  ))}
</div>
                    </div>

                    {/* Right Column: Logistics & Summary */}
                    <div className="lg:col-span-5 bg-[#FCFBFA] p-6 lg:p-8 flex flex-col gap-8 relative">
  {/* Single Edit Icon */}
  {/* Single Edit Icon – only show when status allows editing */}
{!order.isEditingCustomer && canEditOrder(order.status) && (
  <Edit3
    size={14}
    className="absolute top-4 right-4 cursor-pointer text-stone-400 hover:text-stone-600"
    onClick={() => startCustomerEdit(order._id)}
  />
)}

  {/* Customer Information Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Customer Name & Phone */}
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
        <User size={12} /> Customer
      </h4>

      {order.isEditingCustomer ? (
        <div className="flex flex-col gap-2">
          <input
            name="name"
            value={order.editCustomerData?.name || ""}
            onChange={(e) =>
              handleCustomerChange(order._id, e.target.name, e.target.value)
            }
            className="text-sm p-1 border border-stone-200 rounded"
          />
          <input
            name="phone"
            value={order.editCustomerData?.phone || ""}
            onChange={(e) =>
              handleCustomerChange(order._id, e.target.name, e.target.value)
            }
            className="text-sm p-1 border border-stone-200 rounded"
          />
        </div>
      ) : (
        <div>
          <p className="text-sm font-bold text-stone-800">{order.address?.name || "—"}</p>
          <p className="text-xs text-stone-500 font-medium">{order.address?.phone || "—"}</p>
        </div>
      )}
    </div>

    {/* Address */}
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
        <MapPin size={12} /> Address
      </h4>

      {order.isEditingCustomer ? (
        <div className="flex flex-col gap-2">
          <input
            name="street"
            value={order.editCustomerData?.street || ""}
            onChange={(e) =>
              handleCustomerChange(order._id, e.target.name, e.target.value)
            }
            placeholder="Street"
            className="text-xs p-1 border border-stone-200 rounded"
          />
          <input
            name="city"
            value={order.editCustomerData?.city || ""}
            onChange={(e) =>
              handleCustomerChange(order._id, e.target.name, e.target.value)
            }
            placeholder="City"
            className="text-xs p-1 border border-stone-200 rounded"
          />
          <input
            name="state"
            value={order.editCustomerData?.state || ""}
            onChange={(e) =>
              handleCustomerChange(order._id, e.target.name, e.target.value)
            }
            placeholder="State"
            className="text-xs p-1 border border-stone-200 rounded"
          />
          <input
            name="pincode"
            value={order.editCustomerData?.pincode || ""}
            onChange={(e) =>
              handleCustomerChange(order._id, e.target.name, e.target.value)
            }
            placeholder="Pincode"
            className="text-xs p-1 border border-stone-200 rounded"
          />

          {/* Save / Cancel buttons */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => confirmCustomerEdit(order._id, true)}
              className="flex items-center gap-1 text-green-600 text-xs font-bold"
            >
              <CheckSquare size={14} /> Save
            </button>
            <button
              onClick={() => cancelCustomerEdit(order._id)}
              className="flex items-center gap-1 text-red-600 text-xs font-bold"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-stone-600 leading-relaxed font-medium">
          {order.address?.street ? (
            <>
              {order.address.street}<br />
              {order.address.city}, {order.address.state} {order.address.pincode}
            </>
          ) : "No address provided"}
        </p>
      )}
    </div>
  </div>


                      {/* Logistics / Delivery Date */}
                      <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} /> Delivery Schedule
                          </h4>
                          <span className="text-xs font-bold text-[#8B4513]">
                            {formatDisplayDate(order.estimatedDelivery)}
                          </span>
                        </div>

                        {!isFinal && (
                          <div className="relative">
                            <input
                              type="date"
                              value={getDateInputValue(order.estimatedDelivery)}
                              onChange={(e) =>
                                handleDeliveryChange(e, order._id)
                              }
                              className="w-full pl-4 pr-10 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#8B4513]/10 transition-all"
                            />
                            <Clock
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none"
                              size={14}
                            />
                          </div>
                        )}
                      </div>

                      {/* Financial Breakdown */}
                      <div className="mt-auto pt-5 border-t border-stone-200/60">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.15em]">
                            Financial Summary
                          </h4>
                          {/* Subtle badge indicating payment method or count if needed */}
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md">
                            {order.paymentMethod || "PREPAID"}
                          </span>
                        </div>

                        <PriceBreakdown
                          items={order.items}
                          currency={currency}
                        />

                        <div className="mt-4 p-4 bg-[#2D241E] rounded-2xl flex items-center justify-between text-white shadow-lg shadow-stone-200/50 hover:bg-[#3d3129] transition-colors duration-300">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-tight">
                              Total Payable
                            </span>
                            <span className="text-xs font-medium text-emerald-400">
                              Net Amount
                            </span>
                          </div>

                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-medium opacity-80">
                              {currency}
                            </span>
                            <span className="text-2xl font-serif font-semibold tracking-tighter">
                              {Number(order.amount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f9f9f9;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9f9f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
          border: 2px solid #f9f9f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #b0b0b0;
        }
      `}</style>
    </div>
  );
};

export default Orders;
