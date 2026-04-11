import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://backend-project-sa6b.onrender.com/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    const updateUser = () => {
      const u = JSON.parse(localStorage.getItem("customer"));
      setUser(u);
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

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

  // 🔥 MENU CLOSE FUNCTION (FIX)
  const closeMenu = () => {
    const nav = document.getElementById("navbarContent");
    if (nav) {
      nav.classList.remove("show");
      document.body.style.overflow = "";
    }
  };

  // 🔥 BOOTSTRAP MENU CONTROL
  useEffect(() => {
    const nav = document.getElementById("navbarContent");
    if (!nav) return;

    const handleShow = () => {
      document.body.style.overflow = "hidden";
    };

    const handleHide = () => {
      document.body.style.overflow = ""; // FIX
    };

    nav.addEventListener("show.bs.collapse", handleShow);
    nav.addEventListener("hide.bs.collapse", handleHide);

    return () => {
      nav.removeEventListener("show.bs.collapse", handleShow);
      nav.removeEventListener("hide.bs.collapse", handleHide);
    };
  }, []);

  // 🔥 SCROLL CLOSE FIX
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById("navbarContent");
      if (nav && nav.classList.contains("show")) {
        nav.classList.remove("show");
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 OUTSIDE CLICK FIX
  useEffect(() => {
    const handleClickOutside = (e) => {
      const nav = document.getElementById("navbarContent");
      const toggler = document.querySelector(".navbar-toggler");

      if (
        nav &&
        nav.classList.contains("show") &&
        !nav.contains(e.target) &&
        toggler &&
        !toggler.contains(e.target)
      ) {
        nav.classList.remove("show");
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (name) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/crops?search=${name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("storage"));

    setToast("Logout Successful ✅");

    setTimeout(() => {
      setToast("");
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      {toast && <div className="toast-msg">{toast}</div>}

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">

          <Link className="navbar-brand" to="/home" onClick={closeMenu}>
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

          {/* MOBILE SEARCH */}
          <div className="search-box w-100 mt-2 d-lg-none position-relative">
            <input
              className="form-control"
              type="search"
              placeholder="Search crops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {showDropdown && suggestions.length > 0 && (
  <div className="search-dropdown">
    {suggestions.map((item) => (
      <div
        key={item.id}
        className="search-item"
        onClick={() => handleSelect(item.name)}
      >
        {item.name}
      </div>
    ))}
  </div>
)}
          </div>

          <div className="collapse navbar-collapse bg-dark p-3 rounded" id="navbarContent">

            {/* DESKTOP SEARCH */}
            <div className="search-box mx-auto w-50 d-none d-lg-block position-relative">
              <input
                className="form-control"
                type="search"
                placeholder="Search crops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <ul className="navbar-nav ms-auto text-center">

              <li className="nav-item">
                <Link className="nav-link" to="/home" onClick={closeMenu}>Home</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/crops" onClick={closeMenu}>Crops</Link>
              </li>

              <li className="nav-item position-relative">
                <Link className="nav-link" to="/cart" onClick={closeMenu}>
                  Cart 🛒
                  {cartCount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>

              {!user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={closeMenu}>Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register" onClick={closeMenu}>Register</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link text-white"
                    data-bs-toggle="dropdown"
                  >
                    👤 {user.name}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">

                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={closeMenu}>
                        Profile
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/corders" onClick={closeMenu}>
                        My Orders
                      </Link>
                    </li>

                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>

                  </ul>
                </li>
              )}

            </ul>

          </div>
        </div>
      </nav>

      <style>{`
        .toast-msg {
          position: fixed;
          top: 80px;
          right: 15px;
          background: #198754;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
          z-index: 9999;
        }
      `}</style>
    </>
  );
}

export default Navbar;