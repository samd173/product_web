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

  // 🔥 HANDLE REGISTER (UNCHANGED)
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
    <div className="register-page">

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      <div className="register-card">

        {/* BACK */}
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>

        <h3 className="title">📝 Create Account</h3>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <button disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="login-text">
          Already have account? <Link to="/login">Login</Link>
        </p>

      </div>

      {/* 🔥 STYLES */}
      <style>{`
        .register-page {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #198754, #0d6efd);
        }

        .register-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          width: 360px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .title {
          text-align: center;
          margin-bottom: 15px;
        }

        .register-card input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .register-card button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #198754;
          color: white;
          font-weight: bold;
        }

        .register-card button:hover {
          background: #157347;
        }

        .login-text {
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

export default Register;