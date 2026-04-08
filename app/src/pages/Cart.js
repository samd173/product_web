import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Cart() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  // NEW STATES (no logic change)
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
    setToast("Item removed ❌");
    setTimeout(() => setToast(""), 2000);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("storage"));
    setToast("Cart cleared 🗑");
    setTimeout(() => setToast(""), 2000);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // NEW FEATURES
  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(total * 0.1);
      setToast("Coupon applied 🎉");
    } else {
      setDiscount(0);
      setToast("Invalid coupon ❌");
    }
    setTimeout(() => setToast(""), 2000);
  };

  const delivery = total > 500 ? 0 : 40;
  const finalTotal = total - discount + delivery;

  const handleCheckout = () => {
    if (cart.length === 0) {
      setToast("Cart is empty ❌");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/checkout";
  };

  return (
    <>
      <Navbar />

      {toast && <div className="toast-msg">{toast}</div>}

      <div className="container mt-5 pt-4">

        <h3 className="fw-bold mb-4">🛒 Your Cart</h3>

        {cart.length === 0 ? (
          <p className="text-center text-muted">Cart is empty</p>
        ) : (
          <div className="row">

            {/* LEFT */}
            <div className="col-lg-8">

              {cart.map((item) => (
                <div key={item.id} className="card mb-3 shadow-sm border-0">

                  <div className="row g-0 align-items-center">

                    <div className="col-4 col-md-3">
                      <img
                        src={item.image}
                        className="img-fluid"
                        style={{ height: "100px", objectFit: "cover" }}
                      />
                    </div>

                    <div className="col-8 col-md-9">
                      <div className="card-body">

                        <h6>{item.name}</h6>

                        <div className="text-success fw-bold">
                          ₹{item.price}/{item.unit}
                        </div>

                        <div>Total: ₹{item.price * item.qty}</div>

                        <div className="d-flex gap-2 mt-2">
                          <button className="btn btn-danger btn-sm" onClick={() => decreaseQty(item.id)}>-</button>
                          <span>{item.qty}</span>
                          <button className="btn btn-success btn-sm" onClick={() => increaseQty(item.id)}>+</button>
                        </div>

                        <button className="btn btn-link text-danger p-0 mt-2"
                          onClick={() => removeItem(item.id)}>
                          Remove
                        </button>

                      </div>
                    </div>

                  </div>
                </div>
              ))}

            </div>

            {/* RIGHT */}
            <div className="col-lg-4">

              <div className="card p-3 shadow-sm">

                <h5>Price Details</h5>
                <hr />

                <div className="d-flex justify-content-between">
                  <span>Items Total</span>
                  <span>₹{total}</span>
                </div>

                <div className="d-flex justify-content-between text-success">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Delivery</span>
                  <span>{delivery === 0 ? "Free 🚚" : `₹${delivery}`}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>

                {/* COUPON */}
                <div className="mt-3 d-flex gap-2">
                  <input
                    className="form-control"
                    placeholder="Coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>

                <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>
                  Checkout
                </button>

                <button className="btn btn-outline-danger w-100 mt-2" onClick={clearCart}>
                  Clear Cart
                </button>

              </div>

            </div>

          </div>
        )}
      </div>

      <style>{`
        .toast-msg {
          position: fixed;
          top: 80px;
          right: 15px;
          background: #198754;
          color: white;
          padding: 12px;
          border-radius: 8px;
          z-index: 9999;
        }
      `}</style>

    </>
  );
}

export default Cart;