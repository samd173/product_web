import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// User Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Crops from "./pages/Crops";
import Cart from "./pages/Cart";
import COrders from "./pages/COrders";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import Dashboard from "./pages/Admin/Dashboard";
import Orders from "./pages/Admin/Orders";
import Products from "./pages/Admin/Products";

// 🔥 Layout Controller
function Layout() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // 🔥 Hide Navbar/Footer for login + admin
  const hideLayout =
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/admin");

  return (
    <>
      {/* ✅ Navbar */}
      {!hideLayout && <Navbar />}

      <Routes>

        {/* 🔁 DEFAULT REDIRECT (FIXED) */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* 👤 USER ROUTES (PUBLIC) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/crops" element={<Crops />} />

        {/* 🔒 PROTECTED USER ROUTES */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/corders"
          element={
            <ProtectedRoute>
              <COrders />
            </ProtectedRoute>
          }
        />

        {/* 👑 ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔒 PROTECTED ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roleRequired="ADMIN">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute roleRequired="ADMIN">
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute roleRequired="ADMIN">
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* ❌ INVALID ROUTE */}
        <Route
          path="*"
          element={<h2 className="text-center mt-5">Page Not Found ❌</h2>}
        />

      </Routes>

      {/* ✅ Footer */}
      {!hideLayout && <Footer />}
    </>
  );
}

// 🔥 MAIN APP
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;