import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("login failed");
    }
  };

  return (
    <div className="form-wrapper">
      <h1>Login</h1>
      <form className="form" onSubmit={handleLogin}>
        <div className="form-field">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="button log-btn" type="submit">
          Login
        </button>
        <a href="/forgot-password" className="forgot-password">
          Forgot Password?
        </a>
      </form>
    </div>
  );
};

export default Login;
