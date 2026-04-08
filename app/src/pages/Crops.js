import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Crops() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const search = params.get("search");

  useEffect(() => {
    fetch("https://backend-project-sa6b.onrender.com/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);

    const handleStorage = () => {
      const updated = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(updated);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCategory = !category || p.category === category;
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const updateCart = (product, change) => {
    let updated = [...cart];
    const index = updated.findIndex((i) => i.id === product.id);

    if (index !== -1) {
      updated[index].qty += change;
      if (updated[index].qty <= 0) updated.splice(index, 1);
    } else if (change > 0) {
      updated.push({ ...product, qty: 1 });

      setToast("Added to cart ✅");
      setTimeout(() => setToast(""), 2000);
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const buyNow = (product) => {
    const temp = [{ ...product, qty: 1 }];
    localStorage.setItem("buyNow", JSON.stringify(temp));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success"></div>
        <h5 className="mt-3">Loading fresh crops... 🌱</h5>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">

      {toast && <div className="toast-msg">{toast}</div>}

      <h2 className="mb-4 text-center fw-bold">🥬 Fresh Crops</h2>

      <div className="row g-4">

        {filteredProducts.length === 0 ? (
          <p className="text-center text-muted">No products found 😢</p>
        ) : (
          filteredProducts.map((p) => {

            const item = cart.find((i) => i.id === p.id);
            const qty = item ? item.qty : 0;

            return (
              <div className="col-lg-3 col-md-4 col-6" key={p.id}>
                <div className="card h-100 product-card shadow-sm border-0">

                  {/* IMAGE */}
                  <div className="img-box">
                    <img
                      src={p.image || "https://via.placeholder.com/300"}
                      alt={p.name}
                      className="card-img-top"
                    />
                  </div>

                  <div className="card-body text-center">

                    <small className="text-muted">{p.category}</small>

                    <h6 className="fw-bold product-title mt-1">{p.name}</h6>

                    <h5 className="text-success fw-bold">
                      ₹{p.price}
                      <span className="text-muted fs-6">/{p.unit}</span>
                    </h5>

                    <small className="text-muted d-block">
                      Stock: {p.quantity} {p.unit}
                    </small>

                    {p.quantity > 0 ? (
                      <span className="badge bg-success mb-2">In Stock</span>
                    ) : (
                      <span className="badge bg-danger mb-2">Out of Stock</span>
                    )}

                    {/* CART */}
                    {qty === 0 ? (
                      <button
                        className="btn btn-warning w-100 fw-semibold"
                        disabled={p.quantity === 0}
                        onClick={() => updateCart(p, 1)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <button className="btn btn-danger btn-sm" onClick={() => updateCart(p, -1)}>-</button>
                        <span className="fw-bold">{qty}</span>
                        <button className="btn btn-success btn-sm" onClick={() => updateCart(p, 1)}>+</button>
                      </div>
                    )}

                    {/* BUY NOW */}
                    <button
                      className="btn btn-dark w-100 mt-2"
                      disabled={p.quantity === 0}
                      onClick={() => buyNow(p)}
                    >
                      Buy Now
                    </button>

                  </div>
                </div>
              </div>
            );
          })
        )}

      </div>

      {/* STYLE */}
      <style>{`
        .product-card {
          border-radius: 12px;
          transition: 0.3s;
          overflow: hidden;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.2);
        }

        .img-box {
          height: 180px;
          overflow: hidden;
        }

        .img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.4s;
        }

        .product-card:hover img {
          transform: scale(1.1);
        }

        .product-title {
          height: 40px;
          overflow: hidden;
        }

        .toast-msg {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #198754;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
          z-index: 999;
        }
      `}</style>

    </div>
  );
}

export default Crops;