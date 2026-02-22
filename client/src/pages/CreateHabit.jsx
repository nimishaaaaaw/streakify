import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const API_URL = "http://localhost:5000/api";

function CreateHabit() {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, frequency }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create habit");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

return (
  <div className="auth-page">
    <div className="auth-card create-card">
      <h2 className="create-title">
        Create New Habit
      </h2>

      <form onSubmit={handleSubmit} className="auth-form">

        <input
          type="text"
          placeholder="Habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="create-select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button type="submit">
          Create Habit
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="cancel-btn"
        >
          Cancel
        </button>

      </form>
    </div>
  </div>
);
}

export default CreateHabit;