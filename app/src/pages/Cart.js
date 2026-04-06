import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Cart() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  // 🔥 LOAD CART
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  // 🔄 UPDATE CART
  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  // ➕ INCREASE
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  };

  // ➖ DECREASE
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);
    updateCart(updated);
  };

  // ❌ REMOVE
  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);

    setToast("Item removed ❌");
    setTimeout(() => setToast(""), 2000);
  };

  // 🗑 CLEAR
  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("storage"));

    setToast("Cart cleared 🗑");
    setTimeout(() => setToast(""), 2000);
  };

  // 💰 TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🔥 CHECKOUT
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

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      <div className="container mt-5 pt-4">
        <h2 className="mb-4 text-center">🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-center text-muted">Cart is empty</p>
        ) : (
          <div className="row">

            {/* LEFT */}
            <div className="col-md-8">
              {cart.map((item) => (
                <div key={item.id} className="cart-card">

                  {/* IMAGE */}
                  <div className="cart-img">
                    <img src={item.image} alt="" />
                  </div>

                  {/* DETAILS */}
                  <div className="cart-details">
                    <h6>{item.name}</h6>

                    <p className="price">
                      ₹{item.price}/{item.unit}
                    </p>

                    <p className="total">
                      Total: ₹{item.price * item.qty}
                    </p>

                    <div className="qty-box">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    ✖
                  </button>

                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="col-md-4">
              <div className="summary-card">
                <h4>Total</h4>
                <h3>₹{total}</h3>

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

      {/* 🔥 STYLES */}
      <style>{`
        .cart-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: white;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          position: relative;
        }

        .cart-img img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 10px;
        }

        .cart-details {
          flex: 1;
        }

        .price {
          color: #198754;
          font-weight: bold;
        }

        .total {
          font-size: 14px;
        }

        .qty-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qty-box button {
          border: none;
          background: #198754;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 5px;
        }

        .remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          border: none;
          background: red;
          color: white;
          border-radius: 50%;
          width: 25px;
          height: 25px;
        }

        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          text-align: center;
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

    </>
  );
}

export default Cart;