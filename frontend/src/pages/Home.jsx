import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">NoteStack</h1>

      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <Link
            to="/notes"
            className="bg-indigo-600 px-4 py-2 rounded"
          >
            Go to Notes
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-indigo-600 px-4 py-2 rounded"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-slate-700 px-4 py-2 rounded"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;