import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, searchQuery, setSearchQuery } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav style={{
      background: "rgba(253,248,242,0.92)",
      borderBottom: "1px solid rgba(44,36,22,0.1)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      position: "sticky", top: 0, zIndex: 50,
      padding: "0 32px",
      height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px",
      boxShadow: "0 1px 0 rgba(44,36,22,0.06), 0 4px 20px rgba(44,36,22,0.05)",
    }}>

      {/* LOGO */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <div style={{
          width: "34px", height: "34px",
          background: "linear-gradient(135deg, #e8637a 0%, #d4870a 100%)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 10px rgba(232,99,122,0.35)",
          animation: "float-up 4s ease-in-out infinite",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 4C16 8 6 16 4 22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 4C17 6 12 8 8 14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="4" cy="22" r="1.8" fill="white"/>
          </svg>
        </div>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "1.3rem",
          color: "#2c2416",
          letterSpacing: "-0.01em",
        }}>
          NoteStack
        </span>
      </Link>

      {/* SEARCH */}
      {user && (
        <div style={{ flex: 1, maxWidth: "380px", position: "relative" }}>
          <svg style={{
            position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
            color: searchFocused ? "#e8637a" : "#a89880", transition: "color 0.2s",
            pointerEvents: "none",
          }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search your notes…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: "100%",
              background: searchFocused ? "#fff" : "rgba(44,36,22,0.04)",
              border: `1.5px solid ${searchFocused ? "rgba(232,99,122,0.5)" : "rgba(44,36,22,0.1)"}`,
              borderRadius: "100px",
              padding: "8.5px 16px 8.5px 38px",
              color: "#2c2416",
              outline: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.875rem",
              transition: "all 0.22s",
              boxShadow: searchFocused ? "0 0 0 3px rgba(232,99,122,0.1), 0 4px 12px rgba(232,99,122,0.08)" : "none",
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{
              position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "#a89880", fontSize: "1rem", lineHeight: 1, padding: "2px",
            }}>×</button>
          )}
        </div>
      )}

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        {!user ? (
          <>
            <Link to="/login" style={{
              padding: "8px 18px", borderRadius: "100px",
              border: "1.5px solid rgba(44,36,22,0.15)",
              color: "#6b5a46",
              textDecoration: "none", fontSize: "0.875rem",
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8637a"; e.currentTarget.style.color = "#e8637a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(44,36,22,0.15)"; e.currentTarget.style.color = "#6b5a46"; }}
            >Login</Link>
            <Link to="/register" className="btn-rose" style={{
              padding: "8px 20px", borderRadius: "100px",
              textDecoration: "none", fontSize: "0.875rem",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>Get Started →</Link>
          </>
        ) : (
          <>
            {/* User pill */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(232,99,122,0.08)",
              border: "1.5px solid rgba(232,99,122,0.18)",
              borderRadius: "100px", padding: "4px 14px 4px 6px",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg, #e8637a, #d4870a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, color: "#fff",
                flexShrink: 0,
              }}>
                {(user.name || user.email || "U")[0].toUpperCase()}
              </div>
              <span style={{
                fontFamily: "'Fira Code', monospace", fontSize: "0.72rem",
                color: "#e8637a", fontWeight: 500,
                maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {user.name || user.email}
              </span>
            </div>

            <button onClick={logout} className="btn-ghost" style={{
              padding: "7px 16px", borderRadius: "100px", fontSize: "0.85rem",
            }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;