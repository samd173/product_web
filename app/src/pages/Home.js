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
    <div className="container py-3">

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      {/* 🔥 ADVANCED SLIDER */}
      <div className="rounded overflow-hidden mb-4 shadow-sm position-relative" style={{ height: "220px" }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${current * 100}%)`,
            transition: "transform 0.8s ease-in-out"
          }}
          onTouchStart={(e) => (window.startX = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            let endX = e.changedTouches[0].clientX;
            if (window.startX - endX > 50) {
              setCurrent((prev) => (prev + 1) % images.length);
            } else if (endX - window.startX > 50) {
              setCurrent((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              );
            }
          }}
        >
          {images.map((img, i) => (
            <div key={i} style={{ minWidth: "100%" }}>
              <img
                src={img}
                alt=""
                className="img-fluid w-100"
                style={{ height: "220px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button
          className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
          style={{ opacity: 0.6 }}
          onClick={() =>
            setCurrent(current === 0 ? images.length - 1 : current - 1)
          }
        >
          ‹
        </button>

        <button
          className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
          style={{ opacity: 0.6 }}
          onClick={() =>
            setCurrent((current + 1) % images.length)
          }
        >
          ›
        </button>

        {/* Dots */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: current === i ? "white" : "gray",
                cursor: "pointer"
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* 🛒 CATEGORIES */}
      <h5 className="mb-3">🛒 Categories</h5>
      <div className="d-flex gap-3 overflow-auto pb-2">
        {["Vegetables", "Fruits", "Grains", "Roots"].map((cat, i) => (
          <div
            key={i}
            className="text-center"
            style={{ minWidth: "80px", cursor: "pointer" }}
            onClick={() => navigate(`/crops?category=${cat}`)}
          >
            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
              style={{ width: "60px", height: "60px" }}
            >
              {cat === "Vegetables" && "🥬"}
              {cat === "Fruits" && "🍎"}
              {cat === "Grains" && "🌾"}
              {cat === "Roots" && "🥔"}
            </div>
            <small className="fw-semibold d-block mt-1">{cat}</small>
          </div>
        ))}
      </div>

      {/* 🔥 PRODUCT SECTIONS */}
      {[
        { title: "🔥 Featured Products", data: products.slice(0, 4) },
        { title: "🌱 Recently Added", data: products.slice(4, 8) }
      ].map((section, idx) => (
        <div key={idx} className="bg-white p-3 rounded shadow-sm mt-4">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold m-0">{section.title}</h6>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => navigate("/crops")}
            >
              View All →
            </button>
          </div>

          <div className="row g-3">
            {section.data.map((p) => {
              const cart = JSON.parse(localStorage.getItem("cart")) || [];
              const item = cart.find((i) => i.id === p.id);
              const qty = item ? item.qty : 0;

              return (
                <div className="col-6 col-md-3" key={p.id}>
                  <div className="card h-100 border-0 shadow-sm">

                    <img
                      src={p.image}
                      className="card-img-top"
                      style={{ height: "140px", objectFit: "cover" }}
                      alt=""
                    />

                    <div className="card-body p-2">

                      <small className="text-muted">{p.category}</small>

                      <h6 className="fw-semibold small">{p.name}</h6>

                      <div className="text-success fw-bold">
                        ₹{p.price}
                        <small className="text-muted">/{p.unit}</small>
                      </div>

                      <small className="text-success">
                        {p.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </small>

                      <div className="mt-2">

                        {qty === 0 ? (
                          <button
                            className="btn btn-warning w-100 btn-sm"
                            onClick={() => updateCart(p, 1)}
                          >
                            🛒 Add to Cart
                          </button>
                        ) : (
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-danger btn-sm" onClick={() => updateCart(p, -1)}>-</button>
                            <span>{qty}</span>
                            <button className="btn btn-success btn-sm" onClick={() => updateCart(p, 1)}>+</button>
                          </div>
                        )}

                        <button
                          className="btn btn-dark w-100 btn-sm mt-1"
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

      {/* ⭐ SERVICES */}
      <div className="row mt-4 text-center">
        <div className="col-12 col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h6>🚚 Fast Delivery</h6>
            <small>Quick delivery at your doorstep</small>
          </div>
        </div>

        <div className="col-12 col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h6>🥬 Fresh Quality</h6>
            <small>Direct from farmers</small>
          </div>
        </div>

        <div className="col-12 col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h6>💰 Best Price</h6>
            <small>Affordable pricing</small>
          </div>
        </div>
      </div>


      {/* 🔥 TOAST STYLE */}
      <style>{`
        .toast-msg {
          position: fixed;
          top: 70px;
          right: 10px;
          background: #198754;
          color: white;
          padding: 10px 15px;
          border-radius: 6px;
          font-size: 14px;
        }
      `}</style>

    </div>
  );
}

export default Home;    
  