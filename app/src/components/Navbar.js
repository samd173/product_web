import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  // 🔥 LOAD PRODUCTS (for suggestions)
  useEffect(() => {
    fetch("https://backend-project-sa6b.onrender.com/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, []);

  // 🔍 FILTER SUGGESTIONS
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
      .slice(0, 5); // top 5 suggestions

    setSuggestions(filtered);
    setShowDropdown(true);
  }, [search, products]);

  // 👉 CLICK SUGGESTION
  const handleSelect = (name) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/crops?search=${name}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container-fluid">

        <Link className="navbar-brand fw-bold" to="/home">
          AgroMart 🌱
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* 🔍 SEARCH WITH DROPDOWN */}
          <div className="search-box mx-auto w-50 position-relative">

            <input
              className="form-control"
              type="search"
              placeholder="Search crops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* 🔽 DROPDOWN */}
            {showDropdown && suggestions.length > 0 && (
              <div className="search-dropdown">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="dropdown-item"
                    onClick={() => handleSelect(item.name)}
                  >
                    🔍 {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 📌 NAV LINKS */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/crops">Crops</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart 🛒</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/corders">My Orders 📦</Link>
            </li>
            <li className="nav-item">
  <Link className="nav-link" to="/profile">
    Profile 👤
  </Link>
</li>
          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;