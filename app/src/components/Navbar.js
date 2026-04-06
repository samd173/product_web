import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 LOAD DATA
  const loadData = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(totalQty);

    const customer = JSON.parse(localStorage.getItem("customer"));
    setUser(customer);

    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(data);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // 🔥 CLOSE DROPDOWN ON OUTSIDE CLICK (NEW FIX)
  useEffect(() => {
    const closeMenu = () => setShowMenu(false);
    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // 🔍 SEARCH
  const handleChange = (value) => {
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/crops?search=${search}`);
    setSuggestions([]);
  };

  const handleSelect = (name) => {
    setSearch(name);
    navigate(`/crops?search=${name}`);
    setSuggestions([]);
  };

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/login");
  };

  const active = (path) =>
    location.pathname === path
      ? "btn btn-success mx-2 my-1"
      : "btn btn-outline-light mx-2 my-1";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 fixed-top w-100">

      <h4
        className="text-success fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/home")}
      >
        🌱 AgroMart
      </h4>

      <button
        className="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">

        {/* 🔍 SEARCH */}
        <div style={{ position: "relative", width: "250px" }} className="mx-3 my-2">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search crops..."
              className="form-control"
              value={search}
              onChange={(e) => handleChange(e.target.value)}
            />
          </form>

          {suggestions.length > 0 && (
            <div
              className="bg-white shadow rounded mt-1"
              style={{ position: "absolute", width: "100%", zIndex: 1000 }}
              onClick={(e) => e.stopPropagation()}  // 🔥 FIX
            >
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.name)}
                  className="p-2 d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.image}
                    alt=""
                    style={{ width: "40px", borderRadius: "8px", marginRight: "10px" }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="ms-auto d-flex flex-column flex-lg-row align-items-lg-center">

          <Link to="/home" className={active("/home")}>Home</Link>
          <Link to="/crops" className={active("/crops")}>Crops</Link>

          {/* 🛒 CART */}
          <Link to="/cart" className="btn btn-warning mx-2 my-1 position-relative">
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-5px",
                right: "-10px",
                background: "red",
                color: "#fff",
                borderRadius: "50%",
                padding: "3px 7px",
                fontSize: "12px"
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* 👤 USER */}
          {user ? (
            <div className="position-relative mx-2 my-1">
              <button
                className="btn btn-outline-light"
                onClick={(e) => {
                  e.stopPropagation();   // 🔥 FIX
                  setShowMenu(!showMenu);
                }}
              >
                👤 {user.name}
              </button>

              {showMenu && (
                <div
                  className="bg-white shadow p-2 rounded position-absolute"
                  style={{ right: 0, top: "40px", minWidth: "160px" }}
                  onClick={(e) => e.stopPropagation()} // 🔥 FIX
                >
                  <button className="dropdown-item" onClick={() => navigate("/profile")}>
                    👤 Profile
                  </button>

                  <button className="dropdown-item" onClick={() => navigate("/corders")}>
                    📦 My Orders
                  </button>

                  <hr />

                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-success mx-2 my-1">Login</Link>
              <Link to="/register" className="btn btn-outline-light mx-2 my-1">Register</Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;