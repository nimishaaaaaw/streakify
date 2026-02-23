import { useEffect, useState } from "react";

const API_URL = "https://streakify-nuij.onrender.com";

function Heatmap({ habitId, token, refreshKey }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/habits/${habitId}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setLogs(data));
  }, [habitId,  token, refreshKey]);

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    return d;
  });

  return (
    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {last30Days.map((day, index) => {
        const completed = logs.some(log =>
          new Date(log.date).toDateString() === day.toDateString()
        );

        return (
          <div
            key={index}
            style={{
              width: 15,
              height: 15,
              background: completed ? "#4caf50" : "#333",
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}

export default Heatmap;