import axios from 'axios';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import {
  Search, Trash2, Tag, TrendingUp, Package,
  CheckCircle, XCircle, Pencil, Upload,
} from 'lucide-react';

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Max discount
  const [maxDiscount, setMaxDiscount] = useState({ value: 0, description: '' });
  const [maxDiscountInput, setMaxDiscountInput] = useState('0');

  // Editing
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Image previews: { "productId-index": url }
  const [previews, setPreviews] = useState({});

  // ─── Data Fetching ────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      setProducts(data.success ? data.products || [] : []);
      if (!data.success) toast.error(data.message || 'Failed to load products');
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (data.success) setOrders(data.orders || []);
    } catch {
      // silent fail — orders are secondary
    }
  }, [token]);

 const fetchMaxDiscount = useCallback(async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/maxDiscount/get`, {
      headers: { token },
    });

    // Handle both possible shapes: direct object OR { maxDiscount: {...} }
    const md = data.maxDiscount || data;

    if (md && typeof md === 'object' && 'value' in md) {
      const rounded = Math.round(Number(md.value));
      setMaxDiscount({
        value: rounded,
        description: md.description || '',
        isActive: !!md.isActive,
      });
      setMaxDiscountInput(String(rounded));
    } else {
      console.warn('Max discount response missing value field', data);
    }
  } catch (err) {
    console.warn('Failed to fetch max discount', err);
  }
}, [token]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchMaxDiscount();
  }, [fetchProducts, fetchOrders, fetchMaxDiscount]);

  // ─── Image Handling ───────────────────────────────────────────────

  const handleImageChange = (productId, index, file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const key = `${productId}-${index}`;

    setPreviews((prev) => ({ ...prev, [key]: previewUrl }));
    setEditData((prev) => ({ ...prev, [`image${index + 1}`]: file }));
  };

  // Clean up object URLs when component unmounts or editing changes
  useEffect(() => {
    return () => {
      Object.values(previews).forEach(URL.revokeObjectURL);
    };
  }, [previews]);

  const getImageSrc = (product, index) => {
    const key = `${product._id}-${index}`;
    return previews[key] || product.image?.[index] || 'https://via.placeholder.com/96?text=No+Image';
  };

  // ─── Editing Logic ────────────────────────────────────────────────

  const startEditing = useCallback((product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name || '',
      price: String(product.price || 0),
      category: product.category || '',
      discount: String(product.discount ?? 0),
    });
    setPreviews({}); // clear old previews
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditData({});
    setPreviews({});
  }, []);

  const saveProduct = useCallback(async (product) => {
    if (isSaving) return;
    setIsSaving(true);

    const updates = {};

    if (editData.name?.trim() !== product.name) updates.name = editData.name.trim();
    if (Number(editData.price) !== Number(product.price)) updates.price = Number(editData.price);
    if (editData.category?.trim() !== product.category) updates.category = editData.category.trim();
    if (Number(editData.discount) !== Number(product.discount ?? 0)) {
      updates.discount = Number(editData.discount);
    }

    const formData = new FormData();
    formData.append('id', product._id);

    Object.entries(updates).forEach(([k, v]) => formData.append(k, v));

    // Only append changed images
    for (let i = 1; i <= 4; i++) {
      if (editData[`image${i}`]) {
        formData.append(`image${i}`, editData[`image${i}`]);
      }
    }

    try {
      const { data } = await axios.put(`${backendUrl}/api/product/update`, formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Product updated');
        await fetchProducts();
        cancelEdit();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch {
      toast.error('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, editData, token, fetchProducts, cancelEdit]);

  const removeProduct = useCallback(async (id) => {
    if (!window.confirm('Delete product permanently?')) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (data.success) {
        toast.success('Product removed');
        fetchProducts();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    }
  }, [token, fetchProducts]);

const updateMaxDiscount = useCallback(async () => {
  const value = Number(maxDiscountInput);

  if (!Number.isInteger(value) || value < 0 || value > 100) {
    toast.error('Please enter a whole number between 0 and 100');
    return;
  }

  try {
    const { data } = await axios.post(
      `${backendUrl}/api/maxDiscount/update`,
      { value, description: maxDiscount.description || '', isActive: true },
      { headers: { token } }
    );

    // ── Success detection that works with your current backend response ──
    // We consider it successful if we got back an object with .value
    const isSuccessful = data && typeof data === 'object' && 'value' in data;

    if (isSuccessful) {
      // Use the value the backend actually returned (most trustworthy)
      const returnedValue = Number(data.value);
      const rounded = Math.round(returnedValue); // just in case

      setMaxDiscount({
        value: rounded,
        description: data.description || '',
        isActive: !!data.isActive,
        // you can add createdAt/updatedAt/__v if you want, but not necessary
      });

      setMaxDiscountInput(String(rounded));

      toast.success(`Maximum discount updated to ${rounded}%`);
      
      // Optional but recommended: re-fetch to make sure UI is in sync
      // await fetchMaxDiscount();
    } else {
      // This branch should now almost never happen
      toast.error(data?.message || 'Update failed (unexpected response format)');
    }
  } catch (err) {
    console.error('Max discount update error:', err);
    toast.error(
      err.response?.data?.message ||
      err.message ||
      'Failed to update max discount (network/server error)'
    );
  }
}, [maxDiscountInput, maxDiscount.description, token]);

  // ─── Stats & Derived Data ─────────────────────────────────────────

  const computeStats = useCallback((productId) => {
    let ordered = 0, delivered = 0, cancelled = 0, revenue = 0;

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (item.productId === productId) {
          const qty = item.quantity || 0;
          ordered += qty;
          if (order.status === 'Delivered') {
            delivered += qty;
            revenue += (item.finalPrice ?? item.price ?? 0) * qty;
          }
          if (order.status === 'Cancelled') cancelled += qty;
        }
      });
    });

    return { ordered, delivered, cancelled, revenue };
  }, [orders]);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => (p.name || '').toLowerCase().includes(searchTerm.trim().toLowerCase()))
      .filter((p) => categoryFilter === 'All' || p.category === categoryFilter)
      .sort((a, b) => {
        if (sortBy === 'price-low')  return Number(a.price || 0) - Number(b.price || 0);
        if (sortBy === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
        if (sortBy === 'revenue') {
          return computeStats(b._id).revenue - computeStats(a._id).revenue;
        }
        return 0; // newest (default)
      });
  }, [products, searchTerm, categoryFilter, sortBy, computeStats]);

  const totalRevenue = useMemo(() =>
    products.reduce((sum, p) => sum + computeStats(p._id).revenue, 0),
  [products, computeStats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-[#FCFBF9] min-h-screen text-[#2D241E]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          <h3 className="text-4xl font-serif font-medium mb-2">Inventory</h3>
          <p className="text-stone-400 font-medium">Manage boutique offerings & track performance</p>

          <div className="mt-4 p-4 bg-white border border-stone-200 rounded-2xl shadow-sm inline-block">
            <p className="text-sm text-stone-600 mb-2">
              Current Max Discount: <strong>{maxDiscount.value}%</strong>
              {maxDiscount.description && ` — ${maxDiscount.description}`}
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={maxDiscountInput}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,3}$/.test(val)) setMaxDiscountInput(val);
                }}
                className="border border-stone-300 rounded-lg px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                placeholder="0–100"
              />
              <button
                onClick={updateMaxDiscount}
                className="bg-[#8B4513] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#6d3610] transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto flex-wrap">
          <div className="bg-white border border-stone-200 p-4 rounded-2xl shadow-sm min-w-[140px]">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">
              Catalog Size
            </p>
            <p className="text-2xl font-semibold">
              {products.length} <span className="text-xs text-stone-400">items</span>
            </p>
          </div>
          <div className="bg-[#2D241E] p-4 rounded-2xl shadow-lg shadow-stone-300/30 min-w-[160px]">
            <p className="text-[10px] uppercase tracking-wider text-stone-300 font-bold mb-1">
              Total Revenue
            </p>
            <p className="text-2xl font-semibold text-white">
              {currency}{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-stone-300 rounded-xl px-4 py-2.5 bg-white min-w-[160px]"
        >
          <option value="All">All Categories</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-stone-300 rounded-xl px-4 py-2.5 bg-white min-w-[180px]"
        >
          <option value="newest">Newest first</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="revenue">Highest revenue</option>
        </select>
      </div>

      {/* Product List */}
      <div className="space-y-5">
        {filteredAndSortedProducts.map((product) => {
          const stats = computeStats(product._id);
          const isEditing = editingId === product._id;

          const discount = Number(product.discount ?? 0);
          const salePrice = product.price * (1 - discount / 100);

          const showAllImages = isEditing;
          const visibleIndices = showAllImages ? [0,1,2,3] : [0];

          return (
            <div
              key={product._id}
              className={`bg-white border rounded-2xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-[minmax(100px,140px)_2.4fr_1.4fr_1.3fr_1.3fr_1.6fr_auto] gap-5 transition-all hover:border-stone-300 hover:shadow ${
                isEditing ? 'border-amber-400 shadow-md ring-1 ring-amber-200' : 'border-stone-100'
              }`}
            >
              {/* Images */}
              <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-3">
  {visibleIndices.map((idx) => (
    <div
      key={idx}
      className="relative bg-stone-50 rounded-xl overflow-hidden group w-full aspect-[4/5]"
    >
      <img
        src={getImageSrc(product, idx)}
        alt={`Product ${idx + 1}`}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/96?text=×'; }}
      />

      {isEditing && (
        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <Upload size={20} className="text-white" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageChange(product._id, idx, e.target.files[0])}
          />
        </label>
      )}
    </div>
  ))}
</div>


              {/* Name & Category */}
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <input
                      value={editData.category ?? ''}
                      onChange={(e) => setEditData(p => ({ ...p, category: e.target.value }))}
                      className="text-xs font-black uppercase tracking-widest bg-white border border-stone-300 rounded px-2.5 py-1 w-full"
                      placeholder="Category"
                    />
                    <input
                      value={editData.name ?? ''}
                      onChange={(e) => setEditData(p => ({ ...p, name: e.target.value }))}
                      className="text-lg font-bold bg-white border border-stone-300 rounded px-2.5 py-1.5 w-full"
                      placeholder="Product name"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-xs font-black text-stone-500 uppercase tracking-widest">
                      {product.category || '—'}
                    </p>
                    <p className="text-lg font-bold leading-tight">{product.name || 'Unnamed'}</p>
                  </>
                )}
                <p className="text-xs text-stone-400">
                  ID: {product._id?.slice(-8).toUpperCase() || '—'}
                </p>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400 uppercase w-10">MRP</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.price ?? ''}
                      onChange={(e) => setEditData(p => ({ ...p, price: e.target.value }))}
                      className="text-sm font-medium border border-stone-300 rounded px-2.5 py-1 w-28"
                    />
                  ) : (
                    <span className="text-sm line-through text-stone-500">
                      {currency}{Number(product.price || 0).toFixed(0)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700 uppercase w-10">Sale</span>
                  <span className="text-lg font-bold text-[#8B4513]">
                    {currency}{salePrice.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-stone-400" />
                  <span>{stats.ordered} <span className="text-xs text-stone-500">ordered</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-stone-400" />
                  <span>
                    {stats.ordered > 0 ? ((stats.delivered / stats.ordered) * 100).toFixed(0) : 0}%
                    <span className="text-xs text-stone-500 ml-1">conv.</span>
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex md:flex-col gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
                  <CheckCircle size={14} /> {stats.delivered} Delivered
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold">
                  <XCircle size={14} /> {stats.cancelled} Cancelled
                </div>
              </div>

              {/* Revenue */}
              <div className="text-right">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-tight mb-0.5">Revenue</p>
                <p className="text-xl font-serif font-bold text-stone-900">
                  {currency}{stats.revenue.toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 flex-wrap">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveProduct(product)}
                      disabled={isSaving}
                      className="p-2.5 rounded-xl text-green-600 hover:bg-green-50 disabled:opacity-50"
                      title="Save"
                    >
                      <CheckCircle size={22} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={isSaving}
                      className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 disabled:opacity-50"
                      title="Cancel"
                    >
                      <XCircle size={22} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(product)}
                      className="p-2.5 rounded-xl text-stone-500 hover:text-amber-700 hover:bg-amber-50"
                      title="Edit"
                    >
                      <Pencil size={22} />
                    </button>

                    <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-2 py-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        defaultValue={product.discount ?? 0}
                        className="w-14 text-center text-sm font-bold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== Number(product.discount ?? 0)) {
                            saveProduct({ ...product, discount: val });
                          }
                        }}
                      />
                      <span className="text-xs text-stone-500 mx-1">%</span>
                      <button
                        className="bg-stone-700 text-white p-1.5 rounded-lg hover:bg-stone-800"
                        onClick={(e) => {
                          const input = e.currentTarget.parentElement.querySelector('input');
                          const val = Number(input?.value);
                          if (val !== Number(product.discount ?? 0)) {
                            saveProduct({ ...product, discount: val });
                          }
                        }}
                      >
                        <Tag size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeProduct(product._id)}
                      className="p-2.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 size={22} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;