import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Home.css";
import PhotoUpload from "../PhotoUpload/PhotoUpload";
import AllPhotos from "../AllPhotos/AllPhotos";

const Home = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [users, setUsers] = useState([]);

  const role = localStorage.getItem("role");

  const [photos, setPhotos] = useState([]);

  const handleAddPhoto = (photoDataUrl) => {
    setPhotos((prev) => [...prev, photoDataUrl]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          alert(data.message || "Failed to delete user");
        } else {
          const text = await res.text();
          console.error("Non-JSON error:", text);
          alert("Server error, invalid response");
        }
        return;
      }

      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting user");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:5000/api/users/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        alert(data.message || "Unauthorized");
        navigate("/");
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="wrapper">
      <nav className="navbar">
        <div>
          <a
            className={`button btn ${role === "user" ? "disabled" : ""}`}
            href={role === "admin" ? "/create" : "#"}
            onClick={(e) => {
              if (role === "user") {
                e.preventDefault();
                alert("Only admins can create new users.");
              }
            }}
            target="_blank"
          >
            Create
          </a>
        </div>
        <div>
          <a
            className="button btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </a>
        </div>
      </nav>

      <main className="user-list-container">
        <PhotoUpload
          onAddPhoto={handleAddPhoto}
          handleRemovePhoto={handleRemovePhoto}
          photos={photos}
        />
        <AllPhotos
          photos={photos.map((photo, index) => ({
            url: photo,
            id: index,
            width: 0,
            height: 0,
          }))}
          onRemovePhoto={handleRemovePhoto}
        />
        <div className="user-list-header">
          <span className="avatar-header">Avatar</span>
          <span className="name-header">Full Name</span>
          <span className="email-header">Email</span>
        </div>

        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id} className="user-list-item">
              <div className="avatar">
                <img
                  src={`http://localhost:5000/${user.avatar}`}
                  alt="avatar"
                  className="avatar-photo"
                />
              </div>
              <span className="name">
                {user.name} {user.surname}
              </span>
              <span className="user">{user.email}</span>
              {role === "admin" && (
                <div className="action-buttons">
                  <button
                    className="button btn btn-edit"
                    onClick={() => navigate(`/edit/${user._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="button btn btn-delete"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
};

export default Home;
