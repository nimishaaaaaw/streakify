import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Heatmap from "../components/Heatmap";
import "../styles/dashboard.css";

const API_URL = "http://localhost:5000/api";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState("");
  const [completedToday, setCompletedToday] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "edit" or "delete"
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editData, setEditData] = useState({
    name: "",
    frequency: "daily",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch(`${API_URL}/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setHabits(data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const completedMap = {};
      data.forEach((habit) => {
        if (habit.lastCompletedDate) {
          const completedDate = new Date(habit.lastCompletedDate);
          completedDate.setHours(0, 0, 0, 0);

          if (completedDate.getTime() === today.getTime()) {
            completedMap[habit._id] = true;
          }
        }
      });

      setCompletedToday(completedMap);
    } catch (err) {
      setError(err.message);
    }
  };

  const completeHabit = async (habitId) => {
    try {
      const response = await fetch(
        `${API_URL}/habits/${habitId}/complete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setCompletedToday((prev) => ({
        ...prev,
        [habitId]: true,
      }));

      fetchHabits();
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      if (err.message === "Habit already completed this period") {
        setCompletedToday((prev) => ({
          ...prev,
          [habitId]: true,
        }));
        setRefreshKey((prev) => prev + 1);
      }
    }
  };

  /* ===============================
     MODAL FUNCTIONS (RESTORED)
  =============================== */

  const openDeleteModal = (habitId) => {
    setSelectedHabitId(habitId);
    setModalType("delete");
    setShowModal(true);
  };

  const openEditModal = (habit) => {
    setSelectedHabitId(habit._id);
    setEditData({
      name: habit.name,
      frequency: habit.frequency,
    });
    setModalType("edit");
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      if (modalType === "delete") {
        await fetch(`${API_URL}/habits/${selectedHabitId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (modalType === "edit") {
        await fetch(`${API_URL}/habits/${selectedHabitId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        });
      }

      setShowModal(false);
      setModalType(null);
      setSelectedHabitId(null);

      fetchHabits();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Your Habits</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* ACTION BUTTONS */}
        <div className="dashboard-actions">
          <button
            className="create-btn"
            onClick={() => navigate("/create")}
          >
            + Create New Habit
          </button>

          <button
            className="analytics-btn"
            onClick={() => navigate("/analytics")}
          >
            Analytics
          </button>
        </div>

        {/* STATS STRIP */}
        <div className="stats-strip">
          <div>Total Habits: {habits.length}</div>
          <div>
            Active Streaks:{" "}
            {habits.filter((h) => h.currentStreak > 0).length}
          </div>
          <div>
            Longest Streak:{" "}
            {habits.length > 0
              ? Math.max(...habits.map((h) => h.longestStreak))
              : 0}
          </div>
        </div>

        {/* HABITS */}
        <div className="habit-list">
          {habits.length === 0 ? (
            <p>No habits yet.</p>
          ) : (
            habits.map((habit) => (
              <div key={habit._id} className="habit-card">
                <h3>{habit.name}</h3>

                <p>Frequency: {habit.frequency}</p>

                <p className="habit-date">
                  Created on:{" "}
                  {new Date(habit.createdAt).toLocaleDateString()}
                </p>

                <div className="streak-badge">
                  🔥 {habit.currentStreak}
                </div>

                <p>Longest Streak: {habit.longestStreak}</p>

                {habit.frequency === "daily" && (
                  <div style={{ margin: "10px 0" }}>
                    <Heatmap
                      habitId={habit._id}
                      token={token}
                      refreshKey={refreshKey}
                    />
                  </div>
                )}

                <div className="habit-actions">
                  <button
                    className="complete-btn"
                    onClick={() => completeHabit(habit._id)}
                    disabled={completedToday[habit._id]}
                  >
                    {completedToday[habit._id]
                      ? "Completed Today ✓"
                      : "Mark as Done"}
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(habit)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => openDeleteModal(habit._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmAction}
          title={modalType === "edit" ? "Edit Habit" : "Delete Habit"}
        >
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this habit?</p>
          ) : (
            <>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="modal-input"
              />

              <select
                value={editData.frequency}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    frequency: e.target.value,
                  })
                }
                className="modal-input"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </>
          )}
        </Modal>

      </div>
    </div>
  );
}

export default Dashboard;