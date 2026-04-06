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

  // 📦 COD ORDER (UNCHANGED)
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

  // 💳 RAZORPAY (UNCHANGED)
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

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      <h2 className="text-center mb-4">💳 Checkout</h2>

      <div className="row g-4">

        {/* LEFT */}
        <div className="col-md-7">
          <div className="checkout-card">

            <h5>👤 Billing Details</h5>

            <input className="form-control mb-2" placeholder="Full Name" defaultValue={user?.name || ""} />
            <input className="form-control mb-2" placeholder="Email" defaultValue={user?.email || ""} />
            <input className="form-control mb-2" placeholder="Address" />
            <input className="form-control mb-3" placeholder="Phone" />

            <h6>💳 Payment Method</h6>

            <label className="d-block">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              /> Cash on Delivery
            </label>

            <label className="d-block">
              <input
                type="radio"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              /> Online Payment (Razorpay)
            </label>

            <button
              className="btn btn-success w-100 mt-3"
              onClick={paymentMethod === "COD" ? placeOrder : handleRazorpayPayment}
            >
              Pay ₹{total}
            </button>

          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-5">
          <div className="summary-card">

            <h5>🧾 Order Summary</h5>

            {items.map((item, i) => (
              <div key={i} className="summary-item">
                <span>{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <hr />

            <div className="total-box">
              <h6>Total</h6>
              <h5>₹{total}</h5>
            </div>

          </div>
        </div>

      </div>

      {/* 🔥 STYLES */}
      <style>{`
        .checkout-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .total-box {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }

        .toast-msg {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #198754;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
        }
      `}</style>

    </div>
  );
}

export default Checkout;