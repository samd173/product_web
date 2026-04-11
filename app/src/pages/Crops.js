import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";

function Crops() {
  const { products } = useContext(ProductContext);
 
  useEffect(() => {
    if (products.length > 0){
      setLoading(false);
    }
  },[products]);
    
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [sort, setSort] = useState(""); // ✅ NEW (no logic change)

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const search = params.get("search");

  // 🔥 LOAD CART (UNCHANGED)
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

  // 🔍 FILTER (UNCHANGED)
  const filteredProducts = products.filter((p) => {
    const matchCategory = !category || p.category === category;
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // 🔥 SORT (NEW - safe layer)
  let finalProducts = [...filteredProducts];

  if (sort === "low") {
    finalProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    finalProducts.sort((a, b) => b.price - a.price);
  }

  // 🛒 UPDATE CART (UNCHANGED)
  const updateCart = (product, change) => {
    if (!localStorage.getItem("customer")) {
  navigate("/login", { state: { from: window.location.pathname } });
  return;
}
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
    if (!localStorage.getItem("customer")) {
  navigate("/login", { state: { from: window.location.pathname } });
  return;
}
    const temp = [{ ...product, qty: 1 }];
    localStorage.setItem("buyNow", JSON.stringify(temp));
    navigate("/checkout");
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success"></div>
        <h5 className="mt-3">Loading fresh crops... 🌱</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-5 pt-4">

      {toast && <div className="toast-msg">{toast}</div>}

      <div className="row">

        {/* SIDEBAR */}
        <div className="col-lg-2 d-none d-lg-block">
          <div className="bg-white p-3 shadow-sm rounded">
            <h6 className="fw-bold">Filters</h6>

            <hr />

            <p className="fw-semibold mb-1">Category</p>
            <div className="text-muted small">
              <div>Vegetables</div>
              <div>Fruits</div>
              <div>Grains</div>
              <div>Roots</div>
            </div>

            <hr />

            <p className="fw-semibold mb-1">Price</p>
            <div className="text-muted small">
              <div>Below ₹50</div>
              <div>₹50 - ₹100</div>
              <div>Above ₹100</div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="col-lg-10">

          {/* TOP BAR */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0">🥬 Fresh Crops</h5>

            <select
              className="form-select w-auto"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="low">Price Low → High</option>
              <option value="high">Price High → Low</option>
            </select>
          </div>

          {/* PRODUCTS */}
          <div className="row g-4">

            {finalProducts.length === 0 ? (
              <p className="text-center text-muted">No products found 😢</p>
            ) : (
              finalProducts.map((p) => {

                const item = cart.find((i) => i.id === p.id);
                const qty = item ? item.qty : 0;

                return (
                  <div className="col-lg-3 col-md-4 col-6" key={p.id}>
                    <div className="card product-card h-100 shadow-sm border-0">

                      <div className="img-box">
                        <img src={p.image} alt="" />
                      </div>

                      <div className="card-body text-center">

                        <small className="text-muted">{p.category}</small>

                        <h6 className="fw-bold product-title">{p.name}</h6>

                        <h5 className="text-success fw-bold">
                          ₹{p.price}
                          <span className="text-muted fs-6">/{p.unit}</span>
                        </h5>

                        {p.quantity > 0 ? (
                          <span className="badge bg-success mb-2">In Stock</span>
                        ) : (
                          <span className="badge bg-danger mb-2">Out of Stock</span>
                        )}

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
                );
              })
            )}

          </div>

        </div>

      </div>

      <style>{`
        .product-card {
          border-radius: 12px;
          transition: 0.3s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
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
          top: 80px;
          right: 15px;
          background: #198754;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          z-index: 9999;
          box-shadow: 0 5px 15px rgba(0,0,0,0,3);
          font-size: 14px;
        }
      `}</style>

    </div>
  );
}

export default Crops;