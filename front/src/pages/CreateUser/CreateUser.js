import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Invitation sent! Check your email.");
        setEmail("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error inviting user", err);
      alert("Error inviting user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper ">
      <h1>Create User</h1>
      <div className="form">
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          disabled={loading}
        />
        <button onClick={handleInvite} className="button" disabled={loading}>
          {loading ? "Sending..." : "Send Invite"}
        </button>
        <a href="/home" className="btn back">
          {" "}
          Back
        </a>
      </div>
    </div>
  );
};

export default CreateUser;
