import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const API_URL = process.env.REACT_APP_API_URL

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setForm((prev) => ({ ...prev, email: decoded.email || "" }));
      } catch (err) {
        alert("Invalid or expired token");
        navigate("/");
      }
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password reset successfully!");
        navigate("/");
      } else {
        setMessage(data.message || "Error resetting password");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="form-wrapper">
      <h1>Reset Your Password</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={form.email}
            readOnly
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="button" type="submit">
          Save
        </button>

        {message && (
          <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
