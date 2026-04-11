import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname ||"/home";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setToast("Please enter all details ❗");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://backend-project-sa6b.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed ❌");
      }

      if (data.role === "ADMIN") {
        setToast("Please login from Admin Login page ❌");
        setTimeout(() => setToast(""), 2000);
        setLoading(false);
        return;
      }

      const userData = {
        id: data.id,
        name: data.name || form.email.split("@")[0],
        email: data.email || form.email,
        role: data.role || "USER"
      };

      localStorage.setItem("customer", JSON.stringify(userData));
      localStorage.setItem("token", data.token || "");

      setToast("Login Successful ✅");
      setTimeout(() => {
        setToast("");
        navigate(from, { replace: true });
      }, 1500);

    } catch (err) {
      setToast(err.message);
      setTimeout(() => setToast(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">

      {toast && <div className="toast-msg">{toast}</div>}

      <div className="row shadow-lg rounded overflow-hidden" style={{ maxWidth: "850px" }}>

        {/* LEFT SIDE */}
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-4"
          style={{ background: "linear-gradient(135deg, #198754, #0d6efd)" }}>

          <h2 className="fw-bold">Welcome Back 👋</h2>
          <p className="text-center mt-3">
            Login to continue shopping fresh products
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 bg-white p-4">

          {/* BACK */}
          <button
            className="btn btn-link p-0 mb-2"
            onClick={() => navigate(-1)}
          >
            ⬅ Back
          </button>

          <h4 className="fw-bold mb-3 text-center">Login to AgroMart</h4>

          <form onSubmit={handleLogin}>

            <input
              className="form-control mb-2"
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="form-control mb-3"
              type="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button className="btn btn-success w-100 fw-bold" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-center mt-3">
            New user? <Link to="/register">Register</Link>
          </p>

        </div>

      </div>

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

    </div>
  );
}

export default Login;