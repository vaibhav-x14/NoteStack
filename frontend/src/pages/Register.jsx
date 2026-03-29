import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/notes");
    } catch (err) {
      console.log(err.response?.data || err.message);

      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
      }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Create Account
          </h1>
        </div>

        {/* CARD */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>

          {/* ERROR */}
          {error && (
            <div style={{
              background: "#ffe5e5",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "16px",
              color: "red",
              fontSize: "0.9rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "999px",
                background: "#5a8a6a",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* LINK */}
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
