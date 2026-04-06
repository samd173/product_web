import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function COrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("customer"));

    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    fetch(`https://backend-project-sa6b.onrender.com/orders/user/${user.id}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(data => {
        const parsed = data.map(o => ({
          ...o,
          items: JSON.parse(o.items || "[]")
        }));

        setOrders(parsed);
        setLoading(false);
      })
      .catch(() => setLoading(false));

  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "badge bg-warning text-dark";
      case "Processing": return "badge bg-primary";
      case "Out for Delivery": return "badge bg-info text-dark";
      case "Delivered": return "badge bg-success";
      default: return "badge bg-secondary";
    }
  };

  const getStep = (status) => {
    switch (status) {
      case "Pending": return 1;
      case "Processing": return 2;
      case "Out for Delivery": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h3 className="text-center mt-5">Loading orders...</h3>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-5 pt-4">

        <h2 className="mb-4 text-center">📦 My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center text-muted mt-5">No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">

              {/* HEADER */}
              <div className="order-header">
                <div>
                  <h6>Order #{order.id}</h6>
                  <small className="text-muted">
                    {new Date(order.id).toLocaleString()}
                  </small>
                </div>

                <span className={getStatusClass(order.status)}>
                  {order.status}
                </span>
              </div>

              {/* ITEMS */}
              {order.items.map((item, i) => (
                <div key={i} className="order-item">

                  <div className="d-flex align-items-center">
                    <img
                      src={item.image || "https://via.placeholder.com/60"}
                      alt=""
                    />

                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small>Qty: {item.qty}</small>
                    </div>
                  </div>

                  <span>₹{item.price * item.qty}</span>

                </div>
              ))}

              {/* TRACK */}
              <div className="track-box">
                {["Placed", "Processing", "Out for Delivery", "Delivered"].map((step, index) => (
                  <div key={index} className="step">
                    <div
                      className="dot"
                      style={{
                        background:
                          getStep(order.status) > index ? "#198754" : "#ccc"
                      }}
                    ></div>
                    <small>{step}</small>
                  </div>
                ))}
              </div>

              {/* INFO */}
              <div className="order-info">
                <p>🚚 {order.eta || "30 mins"}</p>

                <p>
                  💳{" "}
                  <span className={`badge ${
                    order.paymentMethod === "Razorpay"
                      ? "bg-primary"
                      : "bg-success"
                  }`}>
                    {order.paymentMethod || "COD"}
                  </span>
                </p>
              </div>

              {/* TOTAL */}
              <div className="order-total">
                <span>Total</span>
                <strong>₹{order.total}</strong>
              </div>

            </div>
          ))
        )}

      </div>

      {/* 🔥 STYLES */}
      <style>{`
        .order-card {
          background: white;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
        }

        .order-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 10px;
        }

        .track-box {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
        }

        .step {
          text-align: center;
          flex: 1;
        }

        .dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin: auto;
          margin-bottom: 5px;
        }

        .order-info {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: gray;
        }

        .order-total {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 16px;
        }
      `}</style>

    </>
  );
}

export default COrders;