import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./services/api";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import TrackOrder from "./pages/TrackOrder";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";

function StoreLayout() {
  return <><Navbar /><Outlet /><Footer /></>;
}

function ProtectedAdmin() {
  const location = useLocation();
  const [state, setState] = useState("checking");

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) {
      setState("denied");
      return;
    }
    api.auth.me().then(() => setState("allowed")).catch(() => {
      sessionStorage.removeItem("admin_token");
      setState("denied");
    });
  }, [location.pathname]);

  if (state === "checking") return <div className="loading full-screen">Checking admin session…</div>;
  return state === "allowed" ? <AdminLayout /> : <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
}

export default function App() {
  return <Routes>
    <Route element={<StoreLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order/:id" element={<Order />} />
      <Route path="/track" element={<TrackOrder />} />
    </Route>
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin" element={<ProtectedAdmin />}>
      <Route index element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
