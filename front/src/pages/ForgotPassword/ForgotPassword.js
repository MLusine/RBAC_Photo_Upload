import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || "Check your email for reset link");
  };
  return (
    <div className="form-wrapper">
      <h1>Reset your password</h1>
      <form className="form" onSubmit={handleSubmit}>
        <p>
          To reset your password, enter your email below and submit. An email
          will be sent to you with instructions about how to complete the
          process.
        </p>
        <div className="form-field">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="button" type="submit">
          Reset Password
        </button>
        {message && (
          <p style={{ color: "red", textAlign: "center" }}>{message}</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
