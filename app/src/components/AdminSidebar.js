import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#1e293b",
        color: "#fff",
        height: "100vh"
      }}
    >
      <h4 className="p-3 border-bottom">🛠 Admin Panel</h4>

      <ul className="list-unstyled p-3">

        <li className="mb-3">
          <Link to="/admin/dashboard" className="text-warning text-decoration-none">
            Dashboard
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/admin/products" className="text-white text-decoration-none">
            Products
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/admin/orders" className="text-white text-decoration-none">
            Orders
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default AdminSidebar;