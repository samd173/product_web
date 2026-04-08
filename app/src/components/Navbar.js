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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
  <div className="container-fluid">

    {/* LOGO */}
    <Link className="navbar-brand" to="/home">
      AgroMart 🌱
    </Link>

    {/* 🍔 BUTTON */}
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarContent"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* 🔍 SEARCH (🔥 OUTSIDE COLLAPSE) */}
    <div className="search-box w-100 mt-2 d-lg-none">
      <input
        className="form-control"
        type="search"
        placeholder="Search crops..."
      />
    </div>

    {/* 🔽 MENU */}
    <div className="collapse navbar-collapse bg-dark p-3 rounded" id="navbarContent">

      {/* 🔍 DESKTOP SEARCH */}
      <div className="search-box mx-auto w-50 d-none d-lg-block">
        <input
          className="form-control"
          type="search"
          placeholder="Search crops..."
        />
      </div>

      {/* LINKS */}
      <ul className="navbar-nav ms-auto text-center">
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
          <Link className="nav-link" to="/orders">Orders 📦</Link>
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