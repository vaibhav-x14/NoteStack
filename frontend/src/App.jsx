import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";

const App = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Navigate to={user ? "/notes" : "/login"} />} />
        <Route path="/login"   element={!user ? <Login />    : <Navigate to="/notes" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/notes" />} />
        <Route path="/notes"   element={user  ? <Notes />    : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;