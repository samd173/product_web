import { useEffect, useState } from "react";

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

  // 🔥 NEW (Today / Yesterday)
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

  if (loading) {
    return (
      <>
        <h3 className="text-center mt-5">Loading orders...</h3>
      </>
    );
  }

  return (
    <>
      <div className="container mt-5 pt-4">

        <h3 className="fw-bold text-center mb-4">📦 My Orders</h3>

        {orders.length === 0 ? (
          <p className="text-center text-muted mt-5">No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card mb-4 shadow-sm border-0">

              <div className="card-body">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0">Order #{order.id}</h6>

                    {/* 🔥 FIXED DATE */}
                    <small className="text-muted d-block">
                      {getDateLabel(order.createdAt)} •{" "}
                      {new Date(order.createdAt || Date.now()).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </small>
                  </div>

                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                  >

                    <div className="d-flex align-items-center">

                      <img
                        src={item.image || "https://via.placeholder.com/60"}
                        alt=""
                        style={{
                          width: "65px",
                          height: "65px",
                          borderRadius: "8px",
                          objectFit: "cover"
                        }}
                      />

                      <div className="ms-3">
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">
                          Qty: {item.qty}
                        </small>
                      </div>

                    </div>

                    <strong className="text-success">
                      ₹{item.price * item.qty}
                    </strong>

                  </div>
                ))}

                {/* 🔥 TRACKING BAR */}
                <div className="position-relative mt-4 mb-3">

                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${(getStep(order.status) - 1) * 33}%`
                      }}
                    ></div>
                  </div>

                  <div className="d-flex justify-content-between mt-2">
                    {["Placed", "Processing", "Out", "Delivered"].map((s, i) => (
                      <small key={i} className={
                        getStep(order.status) > i ? "text-success fw-bold" : "text-muted"
                      }>
                        {s}
                      </small>
                    ))}
                  </div>

                </div>

                {/* INFO */}
                <div className="d-flex justify-content-between text-muted small">
                  <span>🚚 ETA: {order.eta || "30 mins"}</span>

                  <span>
                    💳{" "}
                    <span className={`badge ${
                      order.paymentMethod === "Razorpay"
                        ? "bg-primary"
                        : "bg-success"
                    }`}>
                      {order.paymentMethod || "COD"}
                    </span>
                  </span>
                </div>

                {/* TOTAL */}
                <div className="d-flex justify-content-between mt-3 fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-success">₹{order.total}</span>
                </div>

              </div>

            </div>
          ))
        )}

      </div>
    </>
  );
}

export default COrders;