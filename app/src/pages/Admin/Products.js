import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "kg",
    quantity: "",
    image: "",
    category: ""
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://backend-project-sa6b.onrender.com//products");
      const data = await res.json();
      setProducts(data);
    } catch {
      showToast("Failed to load products ❌");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };

      if (file) reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      showToast("Fill required fields ❗");
      return;
    }

    try {
      await fetch("https://backend-project-sa6b.onrender.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity)
        })
      });

      showToast("Product Added ✅");
      loadProducts();
      resetForm();

    } catch {
      showToast("Failed ❌");
    }
  };

  const startEdit = (product) => {
    setEditProduct(product);
    setForm(product);
    setShowModal(true);
  };

  const updateProduct = async () => {
    try {
      await fetch(`https://backend-project-sa6b.onrender.com/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity)
        })
      });

      showToast("Updated ✅");
      loadProducts();
      resetForm();

    } catch {
      showToast("Update failed ❌");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`https://backend-project-sa6b.onrender.com/products/${id}`, {
      method: "DELETE"
    });

    showToast("Deleted successfully 🗑");
    loadProducts();
  };

  const resetForm = () => {
    setShowModal(false);
    setEditProduct(null);
    setForm({
      name: "",
      price: "",
      unit: "kg",
      quantity: "",
      image: "",
      category: ""
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter === "All" || p.category === categoryFilter)
  );

  return (
    <div className="d-flex bg-light min-vh-100">

      <AdminSidebar />

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      <div className="w-100 p-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">📦 Products</h2>
            <p className="text-muted">Manage your inventory</p>
          </div>

          <button
            className="btn btn-success px-4 rounded-pill shadow add-btn"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Product
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="row mb-3 g-2">
          <div className="col-md-6">
            <input
              className="form-control shadow-sm search-box"
              placeholder="🔍 Search products..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-control shadow-sm filter-box"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
              <option>Roots</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="card modern-table border-0">

          <div className="card-body">

            {loading ? (
              <p className="text-center fw-semibold">Loading...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-muted">No products found</p>
            ) : (
              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="product-row">

                        <td>
                          <img
                            src={p.image || "https://via.placeholder.com/50"}
                            alt=""
                            className="product-img"
                          />
                        </td>

                        <td className="fw-semibold">{p.name}</td>

                        <td>
                          <span className="badge bg-primary px-3 py-2">
                            {p.category}
                          </span>
                        </td>

                        <td className="text-success fw-bold">
                          ₹{p.price}/{p.unit}
                        </td>

                        <td>{p.quantity} {p.unit}</td>

                        <td>
                          <span className={`badge px-3 py-2 ${
                            p.quantity > 0 ? "bg-success" : "bg-danger"
                          }`}>
                            {p.quantity > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2 rounded-pill action-btn"
                            onClick={() => startEdit(p)}
                          >
                            ✏️
                          </button>

                          <button
                            className="btn btn-danger btn-sm rounded-pill action-btn"
                            onClick={() => deleteProduct(p.id)}
                          >
                            🗑
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block modal-blur">
          <div className="modal-dialog">
            <div className="modal-content p-4 rounded-4 shadow-lg">

              <h4 className="mb-3 fw-bold">
                {editProduct ? "✏️ Edit Product" : "➕ Add Product"}
              </h4>

              <input name="name" value={form.name} placeholder="Name" className="form-control mb-2" onChange={handleChange} />
              <input name="price" value={form.price} type="number" placeholder="Price" className="form-control mb-2" onChange={handleChange} />

              <select name="unit" value={form.unit} className="form-control mb-2" onChange={handleChange}>
                <option value="kg">kg</option>
                <option value="piece">piece</option>
              </select>

              <input name="quantity" value={form.quantity} type="number" placeholder="Quantity" className="form-control mb-2" onChange={handleChange} />

              <select name="category" value={form.category} className="form-control mb-2" onChange={handleChange}>
                <option value="">Select Category</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
                <option>Roots</option>
              </select>

              <input type="file" name="image" className="form-control mb-2" onChange={handleChange} />

              {form.image && <img src={form.image} alt="" className="preview-img" />}

              <button className="btn btn-success mt-2 rounded-pill" onClick={editProduct ? updateProduct : addProduct}>
                {editProduct ? "Update" : "Add"}
              </button>

              <button className="btn btn-secondary mt-2 rounded-pill" onClick={resetForm}>
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODERN STYLES */}
      <style>{`
        .modern-table {
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        thead {
          background: #111;
          color: white;
        }

        .product-img {
          width: 55px;
          height: 55px;
          object-fit: cover;
          border-radius: 10px;
        }

        .product-row {
          transition: 0.3s;
        }

        .product-row:hover {
          background: #f1f3f5;
          transform: scale(1.01);
        }

        .action-btn {
          transition: 0.2s;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .add-btn:hover {
          transform: scale(1.05);
        }

        .search-box:focus,
        .filter-box:focus {
          box-shadow: 0 0 10px rgba(25,135,84,0.4);
          border-color: #198754;
        }

        .modal-blur {
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
        }

        .preview-img {
          width: 100px;
          border-radius: 10px;
          margin-top: 5px;
        }

        .toast-msg {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #198754;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          z-index: 9999;
          animation: fadeInOut 2s ease;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>

    </div>
  );
}

export default Products;