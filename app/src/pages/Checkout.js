import { useEffect, useState } from "react";

function Checkout() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const buyNowData = JSON.parse(localStorage.getItem("buyNow"));
    const cartData = JSON.parse(localStorage.getItem("cart"));

    const finalItems =
      buyNowData && buyNowData.length > 0 ? buyNowData : cartData;

    setItems(finalItems || []);

    const u = JSON.parse(localStorage.getItem("customer"));
    setUser(u);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    if (!user || !user.id) {
      setToast("Please login first ❌");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    if (items.length === 0) {
      setToast("Cart is empty ❌");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    const orderData = {
      user: { id: user.id },
      total: total,
      items: JSON.stringify(items),
      status: "Pending",
      eta: "30 mins",
      paymentMethod: "COD"
    };

    try {
      const res = await fetch("https://backend-project-sa6b.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error();

      setToast("Order Placed Successfully ✅");
      setTimeout(() => {
        setToast("");
        window.location.href = "/corders";
      }, 2000);

      localStorage.removeItem("cart");
      localStorage.removeItem("buyNow");

    } catch {
      setToast("Order Failed ❌");
      setTimeout(() => setToast(""), 2000);
    }
  };

  const handleRazorpayPayment = () => {

    if (!user || !user.id) {
      setToast("Please login first ❌");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    if (items.length === 0) {
      setToast("Cart is empty ❌");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    const options = {
      key: "rzp_test_SYgu7eUPZ4c9PF",
      amount: total * 100,
      currency: "INR",
      name: "AgroMart",
      description: "Order Payment",

      handler: async function () {

        const orderData = {
          user: { id: user.id },
          total: total,
          items: JSON.stringify(items),
          status: "Paid",
          eta: "30 mins",
          paymentMethod: "Razorpay"
        };

        try {
          const res = await fetch("https://backend-project-sa6b.onrender.com/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(orderData)
          });

          if (!res.ok) throw new Error();

          setToast("Payment Successful & Order Placed ✅");
          setTimeout(() => {
            setToast("");
            window.location.href = "/corders";
          }, 2000);

          localStorage.removeItem("cart");
          localStorage.removeItem("buyNow");

        } catch {
          setToast("Order save failed ❌");
          setTimeout(() => setToast(""), 2000);
        }
      },

      prefill: {
        name: user?.name,
        email: user?.email
      },

      theme: {
        color: "#198754"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container mt-5 pt-4">

      {toast && <div className="toast-msg">{toast}</div>}

      <h3 className="fw-bold text-center mb-4">💳 Checkout</h3>

      <div className="row g-4">

        {/* LEFT */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-4">

            <h5 className="fw-bold mb-3">👤 Billing Details</h5>

            <input className="form-control mb-2" placeholder="Full Name" defaultValue={user?.name || ""} />
            <input className="form-control mb-2" placeholder="Email" defaultValue={user?.email || ""} />
            <input className="form-control mb-2" placeholder="Address" />
            <input className="form-control mb-3" placeholder="Phone" />

            <h6 className="fw-bold mt-3">💳 Payment Method</h6>

            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <label className="form-check-label">Cash on Delivery</label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
              <label className="form-check-label">Online Payment (Razorpay)</label>
            </div>

            <button
              className="btn btn-success w-100 mt-4 fw-bold"
              onClick={paymentMethod === "COD" ? placeOrder : handleRazorpayPayment}
            >
              Pay ₹{total}
            </button>

          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: "100px" }}>

            <h5 className="fw-bold mb-3">🧾 Order Summary</h5>

            {items.map((item, i) => (
              <div key={i} className="d-flex justify-content-between mb-2">
                <span>{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span className="text-success">₹{total}</span>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .toast-msg {
          position: fixed;
          top: 80px;
          right: 15px;
          background: #198754;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
          z-index: 9999;
        }
      `}</style>

    </div>
  );
}

export default Checkout;