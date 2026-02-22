import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import AuthLayout from "../components/AuthLayout";
import "../styles/auth.css";

const API_URL = "https://streakify-nuij.onrender.com/api/auth/login";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <AuthLayout title="Welcome Back To Streakify">
    <form onSubmit={handleSubmit} className="auth-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      <p>
        Don't have an account?{" "}
        <span
  className="auth-link-text"
  onClick={() => navigate("/register")}
>
          Register
        </span>
      </p>
    </form>
  </AuthLayout>
);
  
}

export default Login;