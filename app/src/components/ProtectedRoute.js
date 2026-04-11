import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {

  const location = useLocation(); // ✅ ADD THIS

  // 🔥 अलग-अलग storage
  const admin = JSON.parse(localStorage.getItem("admin"));
  const customer = JSON.parse(localStorage.getItem("customer"));

  // 🔐 अगर admin route है
  if (roleRequired === "ADMIN") {

    if (!admin) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }

    if (admin.role !== "ADMIN") {
      return <Navigate to="/home" replace />;
    }

    return children;
  }

  // 👤 customer route
  if (!customer) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;