import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL

const Register = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    password: "",
    avatar: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("surname", form.surname);
    formData.append("phone", form.phone);
    formData.append("password", form.password);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await fetch(
        `${API_URL}/api/users/register/${token}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful. You can log in.");
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong");
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };
  return (
    <div className="form-wrapper">
      <h1>Complete Your Registration</h1>
      <form onSubmit={handleSubmit} className="form">
        <div>
          <label htmlFor="avatar">Browse Avatar:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && <img src={preview} alt="Preview" width="100" />}
        </div>
        <input
          className="form-input"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          name="surname"
          placeholder="Surname"
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
