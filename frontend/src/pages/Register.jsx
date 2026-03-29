import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register(form);
      navigate("/notes");
    } catch (err) {
  console.log(err);
  setError("Registration failed. Check console.");
} finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name",     label: "Full Name", type: "text",     placeholder: "Your name" },
    { key: "email",    label: "Email",     type: "email",    placeholder: "you@example.com" },
    { key: "password", label: "Password",  type: "password", placeholder: "Choose a password" },
  ];

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: "400px", animation: "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1)" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px",
            background: "linear-gradient(135deg, #5a8a6a, #4a90d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px",
            boxShadow: "0 6px 20px rgba(90,138,106,0.35)",
            animation: "float-up 3s ease-in-out infinite",
            fontSize: "1.6rem",
          }}>🌸</div>
          <p style={{ fontFamily: "'Fira Code', monospace", fontSize: "0.62rem", letterSpacing: "0.25em", color: "#a89880", marginBottom: "8px" }}>GET STARTED</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#2c2416" }}>Create Account</h1>
          <p style={{ color: "#a89880", fontSize: "0.9rem", marginTop: "6px" }}>Your notebook awaits</p>
        </div>

        {/* CARD */}
        <div style={{
          background: "#fff", border: "1.5px solid rgba(44,36,22,0.1)",
          borderRadius: "24px", padding: "32px 28px",
          boxShadow: "0 8px 32px rgba(44,36,22,0.1)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #5a8a6a, #4a90d4, #8b6dc8, #e8637a)" }} />

          {error && (
            <div style={{
              background: "#fff5f7", border: "1.5px solid rgba(232,99,122,0.3)",
              borderRadius: "10px", padding: "10px 14px",
              marginBottom: "20px", color: "#e8637a", fontSize: "0.875rem",
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <label key={f.key} style={{ display: "block", marginBottom: "16px" }}>
                <span style={{ fontFamily: "'Fira Code', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#a89880", display: "block", marginBottom: "7px" }}>
                  {f.label.toUpperCase()}
                </span>
                <input
                  type={f.type} required value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="input-field"
                  style={{ fontSize: "0.925rem" }}
                />
              </label>
            ))}

            <button type="submit" disabled={loading} className="btn-rose"
              style={{
                width: "100%", padding: "12px", borderRadius: "100px",
                fontSize: "0.95rem", marginTop: "8px",
                opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}>
              {loading ? <><div className="spinner" style={{ borderTopColor: "#fff", width: 14, height: 14 }} /> Creating…</> : "Create Account →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "#a89880" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#e8637a", textDecoration: "none", fontWeight: 600, borderBottom: "1.5px solid rgba(232,99,122,0.3)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
