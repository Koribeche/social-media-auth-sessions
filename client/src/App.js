import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Accueil from "./Pages/Accueil/Accueil";
import Profile from "./Pages/Profile/Profile";
import NavBar from "./Components/NavBar";
// import "./App.css";
import axios from "axios";

export default function App() {
  // we are passing the user as props in this app
  // we could use redux or react hooks to simplify this
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/auth/getMe")
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <div className="container pb-2">
        <Routes>
          <Route path="/" element={<Accueil user={user} />} />
          <Route
            path="/login"
            element={<Login user={user} setUser={setUser} />}
          />
          <Route path="/register" element={<Register user={user} />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
