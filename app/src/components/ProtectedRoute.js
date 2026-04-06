import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {

  // 🔥 अलग-अलग storage
  const admin = JSON.parse(localStorage.getItem("admin"));
  const customer = JSON.parse(localStorage.getItem("customer"));

  // 🔐 अगर admin route है
  if (roleRequired === "ADMIN") {

    if (!admin) {
      return <Navigate to="/admin/login" />;
    }

    if (admin.role !== "ADMIN") {
      return <Navigate to="/home" />;
    }

    return children;
  }

  // 👤 customer route
  if (!customer) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;