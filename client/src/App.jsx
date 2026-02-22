import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateHabit from "./pages/CreateHabit";
import Analytics from "./pages/Analytics";
import Splash from "./pages/Splash";

function App() {
  return (
    <Routes>
  <Route path="/" element={<Splash />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/create" element={<CreateHabit />} />
  <Route path="/analytics" element={<Analytics />} />
</Routes>

  );
}

export default App;