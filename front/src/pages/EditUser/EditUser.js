import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    surname: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setForm({ name: data.name || "", surname: data.surname || "" });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update user");

      alert("User updated successfully");
      navigate("/home");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating user");
    }
  };

  return (
    <div className="form-wrapper">
      <h1>Edit </h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          name="surname"
          value={form.surname}
          placeholder="Surname"
          onChange={handleChange}
          required
        />

        <button className="button" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditUser;
