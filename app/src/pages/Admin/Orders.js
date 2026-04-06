import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://backend-project-sa6b.onrender.com/orders");
      const data = await res.json();

      const parsed = data.map(o => ({
        ...o,
        items: JSON.parse(o.items)
      }));

      setOrders(parsed);
    } catch {
      showToast("Failed to load orders ❌");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {

    let eta = "30 mins";

    if (status === "Processing") eta = "20 mins";
    if (status === "Out for Delivery") eta = "10 mins";
    if (status === "Delivered") eta = "Delivered";

    try {
      await fetch(`https://backend-project-sa6b.onrender.com/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status, eta })
      });

      showToast("Status updated ✅");
      loadOrders();

    } catch {
      showToast("Update failed ❌");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">

      <AdminSidebar />

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      <div className="w-100 p-4">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="fw-bold">📦 Orders Management</h2>
          <p className="text-muted">Manage and track all customer orders</p>
        </div>

        {/* TABLE CARD */}
        <div className="card modern-table border-0">

          <div className="card-body">

            {loading ? (
              <p className="text-center fw-semibold">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-muted">No orders found</p>
            ) : (
              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="order-row">

                        <td className="fw-bold text-primary">#{o.id}</td>

                        <td className="fw-semibold">
                          {o.customer || o.user?.name || "User"}
                        </td>

                        <td>
                          {o.items.map((item, i) => (
                            <div key={i} className="small text-muted product-item">
                              • {item.name} × {item.qty}
                            </div>
                          ))}
                        </td>

                        <td className="text-success fw-bold">
                          ₹{o.total}
                        </td>

                        <td>
                          <span className={`badge px-3 py-2 ${
                            o.paymentMethod === "Razorpay"
                              ? "bg-primary"
                              : "bg-success"
                          }`}>
                            {o.paymentMethod || "COD"}
                          </span>
                        </td>

                        <td>
                          <select
                            className={`form-select fw-semibold status-select ${
                              o.status === "Pending"
                                ? "bg-warning text-dark"
                                : o.status === "Processing"
                                ? "bg-primary text-white"
                                : o.status === "Out for Delivery"
                                ? "bg-info text-dark"
                                : "bg-success text-white"
                            }`}
                            value={o.status}
                            onChange={(e) =>
                              updateStatus(o.id, e.target.value)
                            }
                          >
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Out for Delivery</option>
                            <option>Delivered</option>
                          </select>
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
        .modern-table {
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
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

        .product-item {
          transition: 0.2s;
        }

        .product-item:hover {
          color: #198754;
        }

        .status-select {
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .status-select:hover {
          transform: scale(1.05);
        }

        .status-select:focus {
          box-shadow: none;
        }

        .toast-msg {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #198754;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          z-index: 9999;
          animation: fadeInOut 2s ease;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>

    </div>
  );
}

export default Orders;