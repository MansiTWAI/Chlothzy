import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";

// Lazy Loading for Performance
const Home = lazy(() => import("./pages/Home"));
const Collection = lazy(() => import("./pages/Collection"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Cart"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const Orders = lazy(() => import("./pages/Orders"));
const Verification = lazy(() => import("./pages/Verification"));
const FAQ = lazy(() => import("./pages/FAQ"));
const CustomerService = lazy(() => import("./pages/CustomerService"));
const RefundReturn = lazy(() => import("./pages/RefundReturn"));
const Terms = lazy(() => import("./pages/Terms"));
const Shipping = lazy(() => import("./pages/Shipping"));

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-stone-200">
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Navbar />
      <SearchBar />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 md:pt-28">
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-950 rounded-full animate-spin"></div>
            </div>
          }
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/collection/:category?" element={<Collection />} />
        <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Policy & Support Routes */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/returns" element={<RefundReturn />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/shipping" element={<Shipping />} />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="text-center py-20 uppercase tracking-widest">
                  Page Not Found
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
