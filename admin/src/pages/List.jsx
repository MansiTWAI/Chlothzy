import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { Search, Trash2, Tag, TrendingUp, Package, CheckCircle, XCircle } from 'lucide-react'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  // ── Max discount states ────────────────────────────────
  const [maxDiscount, setMaxDiscount] = useState({ value: 0, description: '' })
  const [newMaxDiscount, setNewMaxDiscount] = useState('')

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) setList(response.data.products)
      else toast.error(response.data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) setOrders(response.data.orders || [])
    } catch (error) {
      toast.error(error.message)
    }
  }

 // Fetch max discount
const fetchMaxDiscount = async () => {
  try {
    const res = await axios.get(backendUrl + '/api/maxDiscount/get');
    if (res.data.success) {
      setMaxDiscount(res.data.maxDiscount || { value: 0, description: '' });
      setNewMaxDiscount(res.data.maxDiscount?.value || '');
    }
  } catch (err) {
    console.error(err);
  }
};


// Update max discount
const updateMaxDiscount = async () => {
  const value = Number(newMaxDiscount);
  if (value < 0 || value > 100) {
    return toast.error("Max discount must be between 0 and 100");
  }

  try {
    const res = await axios.post(
      backendUrl + '/api/maxDiscount/update',
      { value, description: maxDiscount.description || '', isActive: true },
      {
        headers: {
          token: token, // ✅ IMPORTANT
        },
      }
    );

    if (res.data.success) {
      setMaxDiscount(res.data.maxDiscount);
      toast.success("Max discount updated");
    }
  } catch (err) {
    toast.error("Not authorised or failed to update");
  }
};



  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateDiscount = async (id, discount) => {
    const value = Number(discount)
    if (isNaN(value) || value < 0 || value > 100) {
      return toast.error("Discount must be 0–100%")
    }

    // Optional: enforce global max discount
    if (value > maxDiscount.value) {
      return toast.error(`Cannot exceed global max discount (${maxDiscount.value}%)`)
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/product/update-discount',
        { productId: id, discount: value },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success("Discount updated")
        await fetchList()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const computeStats = (productId) => {
    let ordered = 0, delivered = 0, cancelled = 0, revenue = 0
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId === productId) {
          ordered += item.quantity
          if (order.status === 'Delivered') {
            delivered += item.quantity
            revenue += (item.finalPrice ?? item.price) * item.quantity
          }
          if (order.status === 'Cancelled') cancelled += item.quantity
        }
      })
    })
    return { ordered, delivered, cancelled, revenue }
  }

  const filteredList = list
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => categoryFilter === 'All' || item.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'revenue') return computeStats(b._id).revenue - computeStats(a._id).revenue
      return 0 // newest (assuming list is already newest first)
    })

  useEffect(() => {
    fetchList()
    fetchOrders()
    fetchMaxDiscount()
  }, [])

  return (
    <div className="p-6 md:p-10 bg-[#FCFBF9] min-h-screen text-[#2D241E]">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          <h3 className="text-4xl font-serif font-medium mb-2">Inventory</h3>
          <p className="text-stone-400 font-medium">Manage your boutique offerings and track sales performance.</p>
          
          {/* Moved max discount control here – shows only once */}
          <div className="mt-4 p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
            <p className="text-sm text-stone-600 mb-2">
              Current Max Discount: <strong>{maxDiscount.value}%</strong>
              {maxDiscount.description && ` — ${maxDiscount.description}`}
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={newMaxDiscount}
                onChange={(e) => setNewMaxDiscount(e.target.value)}
                className="border border-stone-300 rounded-lg px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                placeholder="0-100"
              />
              <button
                onClick={updateMaxDiscount}
                className="bg-[#8B4513] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6d3610] transition-colors"
              >
                Update Max
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <div className="flex-1 bg-white border border-stone-200 p-4 rounded-2xl shadow-sm min-w-[140px]">
            <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-bold mb-1">Catalog Size</p>
            <p className="text-2xl font-semibold">{list.length} <span className="text-xs text-stone-300 font-normal">items</span></p>
          </div>
          <div className="flex-1 bg-[#2D241E] p-4 rounded-2xl shadow-lg shadow-stone-200 min-w-[160px]">
            <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-bold mb-1">Net Revenue</p>
            <p className="text-2xl font-semibold text-white">
              {currency}{list.reduce((acc, curr) => acc + computeStats(curr._id).revenue, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ── rest of your filter bar, legend, list ── remains unchanged ── */}

      <div className="flex flex-col gap-4">
        {filteredList.map((item) => {
          const stats = computeStats(item._id)
          const discountAmount = (item.price * (item.discount || 0)) / 100
          const sellingPrice = item.price - discountAmount

          return (
            <div
              key={item._id}
              className="group bg-white border border-stone-100 rounded-[1.5rem] p-4 md:px-6 md:py-4 grid grid-cols-1 md:grid-cols-[80px_2.5fr_1.5fr_1.2fr_1.2fr_1.5fr_1fr] items-center gap-6 hover:border-stone-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Image */}
              <div className="w-20 h-24 bg-stone-50 rounded-xl overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={item.image[0]} alt="" />
              </div>

              {/* Identity */}
              <div>
                <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-1">{item.category}</p>
                <p className="text-base font-bold text-stone-800 leading-tight">{item.name}</p>
                <p className="text-[10px] text-stone-400 mt-1">ID: {item._id.slice(-6).toUpperCase()}</p>
              </div>

              {/* Price Matrix */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-stone-300 uppercase w-8">MRP</span>
                  <span className="text-sm font-medium line-through text-stone-400">{currency}{item.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-stone-700 uppercase w-8">Sale</span>
                  <span className="text-base font-bold text-[#8B4513]">{currency}{sellingPrice.toFixed(0)}</span>
                </div>
              </div>

              {/* Ordered Stats */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Package size={12} className="text-stone-300" />
                  <span className="text-sm font-semibold">{stats.ordered} <span className="text-[10px] font-normal text-stone-400">Total</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={12} className="text-stone-300" />
                  <span className="text-sm font-semibold">
                    {((stats.delivered / (stats.ordered || 1)) * 100).toFixed(0)}%{' '}
                    <span className="text-[10px] font-normal text-stone-400">Conv.</span>
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex md:flex-col gap-2">
                <div className="flex items-center gap-1.5 py-1 px-2.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
                  <CheckCircle size={12} />
                  <span className="text-[10px] font-bold uppercase">{stats.delivered} Delivered</span>
                </div>
                <div className="flex items-center gap-1.5 py-1 px-2.5 bg-rose-50 text-rose-500 rounded-lg w-fit">
                  <XCircle size={12} />
                  <span className="text-[10px] font-bold uppercase">{stats.cancelled} Cancel</span>
                </div>
              </div>

              {/* Revenue */}
              <div>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter mb-1">Profit/Earnings</p>
                <p className="text-lg font-serif font-bold text-stone-800">{currency}{stats.revenue.toLocaleString()}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end">
                <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl p-1 group/input focus-within:border-stone-400 transition-colors">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={item.discount || 0}
                    className="w-10 bg-transparent text-center text-xs font-bold outline-none"
                    onBlur={(e) => {
                      const val = Number(e.target.value)
                      if (!isNaN(val)) updateDiscount(item._id, val)
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement.querySelector('input')
                      updateDiscount(item._id, Number(input.value))
                    }}
                    className="bg-stone-800 text-white p-1.5 rounded-lg hover:bg-black transition-colors"
                    title="Update Discount"
                  >
                    <Tag size={12} />
                  </button>
                </div>

                <button
                  onClick={() => removeProduct(item._id)}
                  className="p-2.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List