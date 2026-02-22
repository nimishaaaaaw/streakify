import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import "../styles/analytics.css";

const API_URL = "http://localhost:5000/api";

function Analytics() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/habits/analytics/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Analytics error:", err));
  }, []);

  if (!data) return <div style={{ padding: 30 }}>Loading...</div>;



  const completionsChartData =
    data.completionsPerHabit?.map(h => ({
      name: h.name || h.habitName,
      completions: h.completions || h.total || h.count || 0
    })) || [];

  const last30DaysData =
    data.last30Days?.map(d => ({
      date: d.date,
      completions: d.completions || d.count || 0
    })) || [];

  return (
    <div className="analytics-page">
      <div className="analytics-container">

        <h1 className="analytics-title">
          Analytics Overview
        </h1>

        {/* GREEN STRIP */}
        <div className="analytics-stats-strip">
          <div>Total Habits: {data.totalHabits}</div>
          <div>Total Completions: {data.totalCompletions}</div>
          <div>Average Streak: {data.averageStreak}</div>
          <div>
            Best Habit: {data.bestHabit} 🔥 {data.bestHabitStreak}
          </div>
        </div>

        {/* ================= BAR CHART ================= */}

        <div className="analytics-card">
          <h2 className="analytics-subtitle">
            Completion Per Habit
          </h2>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completions" fill="#ff5722" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= LINE CHART ================= */}

        <div className="analytics-card">
          <h2 className="analytics-subtitle">
            Last 30 Day Activity
          </h2>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last30DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke="#4caf50"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;