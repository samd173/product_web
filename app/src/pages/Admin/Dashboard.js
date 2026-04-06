import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("https://backend-project-sa6b.onrender.com/products", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));

    fetch("https://backend-project-sa6b.onrender.com/orders", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.log(err));

  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="d-flex bg-light min-vh-100">

      <AdminSidebar />

      <div className="w-100 p-4">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="fw-bold">📊 Admin Dashboard</h2>
          <p className="text-muted">Overview of your store performance</p>
        </div>

        {/* 🔥 MODERN CARDS */}
        <div className="row g-4">

          <div className="col-md-4">
            <div className="modern-card product-card">
              <div>
                <h6>Total Products</h6>
                <h2>{totalProducts}</h2>
              </div>
              <div className="icon">📦</div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="modern-card order-card">
              <div>
                <h6>Total Orders</h6>
                <h2>{totalOrders}</h2>
              </div>
              <div className="icon">🛒</div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="modern-card revenue-card">
              <div>
                <h6>Revenue</h6>
                <h2>₹{totalRevenue}</h2>
              </div>
              <div className="icon">💰</div>
            </div>
          </div>

        </div>

        {/* 🔥 MODERN TABLE */}
        <div className="card modern-table mt-5">

          <div className="card-body">

            <h4 className="mb-3 fw-bold">📦 Recent Orders</h4>

            {orders.length === 0 ? (
              <p className="text-muted">No orders yet</p>
            ) : (
              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.slice(-5).reverse().map((o) => (
                      <tr key={o.id} className="order-row">

                        <td className="fw-bold text-primary">#{o.id}</td>

                        <td>{o.customer || o.user?.name || "User"}</td>

                        <td className="text-success fw-bold">
                          ₹{o.total}
                        </td>

                        {/* 💳 PAYMENT */}
                        <td>
                          <span className={`badge ${
                            o.paymentMethod === "Razorpay"
                              ? "bg-primary"
                              : "bg-success"
                          }`}>
                            {o.paymentMethod || "COD"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span className={`badge ${
                            o.status === "Pending"
                              ? "bg-warning text-dark"
                              : o.status === "Processing"
                              ? "bg-primary"
                              : o.status === "Out for Delivery"
                              ? "bg-info text-dark"
                              : "bg-success"
                          }`}>
                            {o.status}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* 🔥 MODERN STYLES */}
      <style>{`
        .modern-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-radius: 16px;
          color: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          transition: 0.3s;
        }

        .modern-card h6 {
          opacity: 0.9;
          margin-bottom: 5px;
        }

        .modern-card h2 {
          font-weight: bold;
        }

        .modern-card .icon {
          font-size: 40px;
          opacity: 0.8;
        }

        .modern-card:hover {
          transform: translateY(-5px) scale(1.02);
        }

        /* COLORS */
        .product-card {
          background: linear-gradient(135deg, #0d6efd, #3d8bfd);
        }

        .order-card {
          background: linear-gradient(135deg, #198754, #20c997);
        }

        .revenue-card {
          background: linear-gradient(135deg, #ffc107, #ffda6a);
          color: black;
        }

        /* TABLE */
        .modern-table {
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: none;
        }

        thead {
          background: #111;
          color: white;
        }

        .order-row {
          transition: 0.3s;
        }

        .order-row:hover {
          background: #f1f3f5;
          transform: scale(1.01);
        }
      `}</style>

    </div>
  );
}

export default Dashboard;