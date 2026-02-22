import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/auth.css";

const API_URL = "https://streakify-nuij.onrender.com/api/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Welcome To Streakify">
      {error && (
        <p style={{ color: "#ff3b2f", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "#4caf50", marginBottom: "10px" }}>
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button type="submit">
          Register
        </button>
      </form>

      <p style={{ marginTop: "15px", color: "white" }}>
        Already have an account?{" "}
        <span
  className="auth-link-text"
  onClick={() => navigate("/login")}
>
          Login
        </span>
      </p>
    </AuthLayout>
  );
}

export default Register;