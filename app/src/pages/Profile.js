import { useEffect, useState } from "react";


function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");

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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({ ...user, image: reader.result });
    };

    reader.readAsDataURL(file);
  };

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

      {toast && <div className="toast-msg">{toast}</div>}

      <div className="container mt-5 pt-4">

        <div className="card shadow-lg border-0 p-4 mx-auto" style={{ maxWidth: "550px" }}>

          {/* HEADER */}
          <div className="text-center mb-3">
            <img
              src={user.image || "https://via.placeholder.com/120"}
              alt="profile"
              className="rounded-circle shadow"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />

            <h4 className="mt-2 mb-0">{user.name}</h4>
            <small className="text-muted">{user.email}</small>
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
          <div>

            <label className="form-label">Name</label>
            <input
              className="form-control mb-2"
              name="name"
              value={user.name || ""}
              disabled={!editing}
              onChange={handleChange}
            />

            <label className="form-label">Phone</label>
            <input
              className="form-control mb-2"
              name="phone"
              value={user.phone || ""}
              disabled={!editing}
              onChange={handleChange}
            />

            <label className="form-label">Address</label>
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
              className="btn btn-success w-100 mt-2 fw-bold"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <button
              className="btn btn-primary w-100 mt-2 fw-bold"
              onClick={handleSave}
            >
              💾 Save Changes
            </button>
          )}

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

    </>
  );
}

export default Profile;