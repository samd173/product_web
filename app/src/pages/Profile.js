import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");

  // 🔥 LOAD USER
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("customer"));

    if (!u) return;

    fetch(`https://backend-project-sa6b.onrender.com/user/email/${u.email}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => {
        setToast("Failed to load profile ❌");
        setTimeout(() => setToast(""), 2000);
      });
  }, []);

  // 🔄 INPUT
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 📷 IMAGE
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({ ...user, image: reader.result });
    };

    reader.readAsDataURL(file);
  };

  // 💾 SAVE
  const handleSave = async () => {
    try {
      const res = await fetch(`https://backend-project-sa6b.onrender.com/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          image: user.image || ""
        })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setUser(data);

      localStorage.setItem("customer", JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }));

      setToast("Profile Updated ✅");
      setTimeout(() => setToast(""), 2000);

      setEditing(false);

    } catch {
      setToast("Update failed ❌");
      setTimeout(() => setToast(""), 2000);
    }
  };

  if (!user) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <>
      <Navbar />

      {/* 🔥 TOAST */}
      {toast && <div className="toast-msg">{toast}</div>}

      <div className="container mt-5 pt-4">

        <div className="profile-card">

          {/* HEADER */}
          <div className="profile-header">
            <img
              src={user.image || "https://via.placeholder.com/120"}
              alt="profile"
            />

            <div>
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          {editing && (
            <input
              type="file"
              className="form-control mb-3"
              onChange={handleImage}
            />
          )}

          {/* FORM */}
          <div className="profile-form">

            <label>Name</label>
            <input
              className="form-control mb-2"
              name="name"
              value={user.name || ""}
              disabled={!editing}
              onChange={handleChange}
            />

            <label>Phone</label>
            <input
              className="form-control mb-2"
              name="phone"
              value={user.phone || ""}
              disabled={!editing}
              onChange={handleChange}
            />

            <label>Address</label>
            <textarea
              className="form-control mb-3"
              name="address"
              value={user.address || ""}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

          {/* BUTTON */}
          {!editing ? (
            <button
              className="btn btn-success w-100"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <button
              className="btn btn-primary w-100"
              onClick={handleSave}
            >
              💾 Save Changes
            </button>
          )}

        </div>

      </div>

      <Footer />

      {/* 🔥 STYLES */}
      <style>{`
        .profile-card {
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .profile-header img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-form label {
          font-size: 13px;
          color: gray;
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

    </>
  );
}

export default Profile;