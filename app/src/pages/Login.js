import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const navigate = useNavigate();

  // 🔥 HANDLE LOGIN (UNCHANGED)
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
        navigate("/home");
      }, 1500);

    } catch (err) {
      setToast(err.message);
      setTimeout(() => setToast(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      <div className="login-card">

        {/* BACK */}
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>

        <h3 className="title">🔐 Login to AgroMart</h3>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-text">
          New user? <Link to="/register">Register</Link>
        </p>

      </div>

      {/* 🔥 STYLES */}
      <style>{`
        .login-page {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #198754, #0d6efd);
        }

        .login-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          width: 350px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .title {
          text-align: center;
          margin-bottom: 15px;
        }

        .login-card input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .login-card button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #198754;
          color: white;
          font-weight: bold;
        }

        .login-card button:hover {
          background: #157347;
        }

        .register-text {
          text-align: center;
          margin-top: 10px;
        }

        .back-btn {
          border: none;
          background: none;
          margin-bottom: 10px;
          color: #0d6efd;
        }

        .toast-msg {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #198754;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
        }
      `}</style>

    </div>
  );
}

export default Login;