import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(""); // 🔥 NEW

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // 🔄 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔐 HANDLE LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      showToast("Please enter all details ❗");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
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

      // 🔥 ADMIN ONLY ACCESS
      if (data.role !== "ADMIN") {
        showToast("Access denied ❌ Not an admin");
        setLoading(false);
        return;
      }

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      };

      localStorage.setItem("admin", JSON.stringify(userData));
      localStorage.setItem("token", data.token || "");

      showToast("Admin Login Successful ✅");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1200);

    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page d-flex justify-content-center align-items-center vh-100">

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      <div className="card login-card p-4">

        <h3 className="text-center mb-3 fw-bold text-danger">
          🛠 Admin Panel
        </h3>

        <p className="text-center text-muted mb-3">
          Secure access only
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            className="form-control mb-3 input-modern"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3 input-modern"
            value={form.password}
            onChange={handleChange}
          />

          <button className="btn btn-danger w-100 login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

      {/* 🔥 STYLES */}
      <style>{`
        .admin-login-page {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        }

        .login-card {
          width: 360px;
          border-radius: 16px;
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }

        .input-modern {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
        }

        .input-modern::placeholder {
          color: #ccc;
        }

        .input-modern:focus {
          background: rgba(255,255,255,0.15);
          box-shadow: none;
          border: none;
        }

        .login-btn {
          border-radius: 10px;
          transition: 0.3s;
        }

        .login-btn:hover {
          transform: scale(1.05);
        }

        .toast-msg {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #dc3545;
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

export default AdminLogin;