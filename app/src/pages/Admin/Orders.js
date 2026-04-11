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

  // 🔥 TODAY / YESTERDAY
  const getDateLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    });
  };

  // 🔥 STEP TRACKING
  const getStep = (status) => {
    switch (status) {
      case "Pending": return 1;
      case "Processing": return 2;
      case "Out for Delivery": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
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

      {toast && <div className="toast-msg">{toast}</div>}

      <div className="w-100 p-4">

        <div className="mb-4">
          <h2 className="fw-bold">📦 Orders Management</h2>
        </div>

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
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>

                        <td className="fw-bold text-primary">#{o.id}</td>

                        {/* 🔥 DATE + LABEL */}
                        <td>
                          <div className="badge bg-secondary mb-1">
                            {getDateLabel(o.createdAt)}
                          </div>
                          <div className="small">
                            {new Date(o.createdAt || Date.now()).toLocaleTimeString("en-IN")}
                          </div>
                        </td>

                        <td>{o.customer || o.user?.name || "User"}</td>

                        <td>
                          {o.items.map((item, i) => (
                            <div key={i}>
                              {item.name} × {item.qty}
                            </div>
                          ))}
                        </td>

                        <td className="text-success fw-bold">
                          ₹{o.total}
                        </td>

                        <td>
                          <span className="badge bg-primary">
                            {o.paymentMethod}
                          </span>
                        </td>

                        <td>
                          <select
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

                          {/* 🔥 TRACKING UI */}
                          <div className="timeline mt-2">

                            {["Pending", "Processing", "Out for Delivery", "Delivered"].map((step, i) => (
                              <div key={i} className="timeline-step">

                                <div className={`circle ${
                                  getStep(o.status) > i ? "active" : ""
                                }`}></div>

                                <small>
                                  {step}
                                </small>

                              </div>
                            ))}

                          </div>

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

      <style>{`
        .timeline {
          display: flex;
          justify-content: space-between;
        }

        .timeline-step {
          text-align: center;
          flex: 1;
        }

        .circle {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #ccc;
          margin: auto;
        }

        .circle.active {
          background: #198754;
        }

        .toast-msg {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #198754;
          color: white;
          padding: 10px;
        }
      `}</style>

    </div>
  );
}

export default Orders;