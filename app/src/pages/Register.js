import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setToast("Please fill all fields ❗");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setToast("Passwords do not match ❌");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://backend-project-sa6b.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed ❌");
      }

      setToast("Registered Successfully ✅");

      setTimeout(() => {
        setToast("");
        navigate("/login");
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

          <h2 className="fw-bold">Welcome to AgroMart 🌱</h2>
          <p className="text-center mt-3">
            Fresh products directly from farmers to your home
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

          <h4 className="fw-bold mb-3 text-center">Create Account</h4>

          <form onSubmit={handleRegister}>

            <input
              className="form-control mb-2"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <input
              className="form-control mb-3"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <button className="btn btn-success w-100 fw-bold" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

          <p className="text-center mt-3">
            Already have account? <Link to="/login">Login</Link>
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

export default Register;