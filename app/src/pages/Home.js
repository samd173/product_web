import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [current, setCurrent] = useState(0);
  const [cartRefresh, setCartRefresh] = useState(false);
  const [toast, setToast] = useState("");

  const navigate = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=100",
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1920&q=100",
    "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1920&q=100"
  ];

  // 🔥 Slider (UNCHANGED)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Load products (UNCHANGED)
  useEffect(() => {
    fetch("https://backend-project-sa6b.onrender.com/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  // 🛒 Cart logic (UNCHANGED)
  const updateCart = (product, change) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((i) => i.id === product.id);

    if (index !== -1) {
      cart[index].qty += change;
      if (cart[index].qty <= 0) cart.splice(index, 1);
    } else if (change > 0) {
      cart.push({ ...product, qty: 1 });

      setToast("Added to cart ✅");
      setTimeout(() => setToast(""), 2000);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartRefresh(!cartRefresh);
  };

  const buyNow = (product) => {
    const temp = [{ ...product, qty: 1 }];
    localStorage.setItem("buyNow", JSON.stringify(temp));
    navigate("/checkout");
  };

  return (
    <div className="container mt-5 pt-4">

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      {/* 🔥 SLIDER (UNCHANGED) */}
      <div style={{ overflow: "hidden", height: "320px", borderRadius: "12px" }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${current * 100}%)`,
            transition: "transform 1s ease-in-out"
          }}
        >
          {images.map((img, i) => (
            <div key={i} style={{ minWidth: "100%" }}>
              <img
                src={img}
                alt=""
                style={{ width: "100%", height: "320px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🛒 CATEGORIES (UNCHANGED) */}
      <h3 className="mt-5 mb-3">🛒 Categories</h3>
      <div className="d-flex gap-4 overflow-auto pb-2">
        {["Vegetables", "Fruits", "Grains", "Roots"].map((cat, i) => (
          <div
            key={i}
            onClick={() => navigate(`/crops?category=${cat}`)}
            style={{ minWidth: "90px", textAlign: "center", cursor: "pointer" }}
          >
            <div
              className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "65px", height: "65px", margin: "auto" }}
            >
              {cat === "Vegetables" && "🥬"}
              {cat === "Fruits" && "🍎"}
              {cat === "Grains" && "🌾"}
              {cat === "Roots" && "🥔"}
            </div>
            <small className="fw-semibold mt-2 d-block">{cat}</small>
          </div>
        ))}
      </div>

      {/* 🔥 PRODUCTS */}
      {[{
        title: "🔥 Featured Products",
        data: products.slice(0, 4)
      },
      {
        title: "🌱 Recently Added",
        data: products.slice(-4)
      }].map((section, idx) => (
        <div key={idx}>
          <div className="d-flex justify-content-between align-items-center mt-5">
            <h3>{section.title}</h3>
            <button className="btn btn-outline-success" onClick={() => navigate("/crops")}>
              View All →
            </button>
          </div>

          <div className="row g-4">
            {section.data.map((p) => {
              const cart = JSON.parse(localStorage.getItem("cart")) || [];
              const item = cart.find((i) => i.id === p.id);
              const qty = item ? item.qty : 0;

              return (
                <div className="col-md-3 col-6" key={p.id}>
                  <div className="product-card">

                    {/* IMAGE */}
                    <div className="img-box">
                      <img src={p.image} alt="" />
                    </div>

                    <div className="p-2">

                      <small className="text-muted">{p.category}</small>

                      <h6 className="product-title">{p.name}</h6>

                      <div className="price">
                        ₹{p.price}
                        <span className="unit">/{p.unit}</span>
                      </div>

                      <small className="text-success">
                        {p.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </small>

                      <div className="mt-2">

                        {qty === 0 ? (
                          <button
                            className="btn btn-warning w-100"
                            onClick={() => updateCart(p, 1)}
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-danger btn-sm" onClick={() => updateCart(p, -1)}>-</button>
                            <span>{qty}</span>
                            <button className="btn btn-success btn-sm" onClick={() => updateCart(p, 1)}>+</button>
                          </div>
                        )}

                        <button
                          className="btn btn-dark w-100 mt-2"
                          onClick={() => buyNow(p)}
                        >
                          Buy Now
                        </button>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ⭐ SERVICES (UNCHANGED) */}
      <div className="row text-center mt-5">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h5>🚚 Fast Delivery</h5>
            <p>Quick delivery at your doorstep</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h5>🥬 Fresh Quality</h5>
            <p>Direct from farmers</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h5>💰 Best Price</h5>
            <p>Affordable pricing</p>
          </div>
        </div>
      </div>

      {/* 🔥 STYLES */}
      <style>{`
        .product-card {
          border-radius: 10px;
          background: white;
          transition: 0.3s;
          overflow: hidden;
        }

        .product-card:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .img-box {
          height: 150px;
        }

        .img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-title {
          font-size: 14px;
          font-weight: 600;
          height: 35px;
          overflow: hidden;
        }

        .price {
          font-weight: bold;
          color: #198754;
        }

        .unit {
          font-size: 12px;
          color: gray;
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

export default Home;