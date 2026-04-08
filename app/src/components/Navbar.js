import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔥 NEW (Cart badge)
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  // 🔥 LOAD PRODUCTS (UNCHANGED)
  useEffect(() => {
    fetch("https://backend-project-sa6b.onrender.com/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, []);

  // 🔥 NEW (Cart count update)
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
      setCartCount(totalQty);
    };

    updateCount();
    window.addEventListener("storage", updateCount);

    return () => window.removeEventListener("storage", updateCount);
  }, []);

  // 🔍 FILTER SUGGESTIONS (UNCHANGED)
  useEffect(() => {
    if (search.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const filtered = products
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(filtered);
    setShowDropdown(true);
  }, [search, products]);

  // 👉 CLICK SUGGESTION (UNCHANGED)
  const handleSelect = (name) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/crops?search=${name}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">

        {/* LOGO */}
        <Link className="navbar-brand" to="/home">
          AgroMart 🌱
        </Link>

        {/* TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔍 MOBILE SEARCH */}
        <div className="search-box w-100 mt-2 d-lg-none position-relative">
          <input
            className="form-control"
            type="search"
            placeholder="Search crops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {showDropdown && (
            <div className="dropdown-box">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="dropdown-item"
                  onClick={() => handleSelect(item.name)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MENU */}
        <div className="collapse navbar-collapse bg-dark p-3 rounded" id="navbarContent">

          {/* 🔍 DESKTOP SEARCH */}
          <div className="search-box mx-auto w-50 d-none d-lg-block position-relative">
            <input
              className="form-control"
              type="search"
              placeholder="Search crops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {showDropdown && (
              <div className="dropdown-box">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="dropdown-item"
                    onClick={() => handleSelect(item.name)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LINKS */}
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/crops">Crops</Link>
            </li>

            {/* 🛒 CART WITH BADGE */}
            <li className="nav-item position-relative">
              <Link className="nav-link" to="/cart">
                Cart 🛒
                {cartCount > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/corders">Orders 📦</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile 👤</Link>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;