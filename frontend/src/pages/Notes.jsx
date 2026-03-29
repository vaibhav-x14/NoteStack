import { useEffect, useState, useCallback } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import VoiceButton from "../components/VoiceButton";

/* ── AI SUMMARISE ── */
/*async function summariseNote(title, content) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Summarise this note in 1-2 sentences. Return only the summary text, nothing else.\n\nTitle: ${title}\nContent: ${content || "(no content)"}`,
      }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? "Could not generate summary.";
}*/

async function summariseNote(title, content) {
  const res = await API.post("/summarize", { title, content });
  return res.data.summary;
}

/* rotating accent colours for cards */
const ACCENTS = ["accent-rose", "accent-sage", "accent-amber", "accent-sky", "accent-lavender"];
const ACCENT_COLORS = {
  "accent-rose":     { bg: "#fff5f7", label: "#e8637a" },
  "accent-sage":     { bg: "#f4faf6", label: "#5a8a6a" },
  "accent-amber":    { bg: "#fffbf0", label: "#d4870a" },
  "accent-sky":      { bg: "#f0f7ff", label: "#4a90d4" },
  "accent-lavender": { bg: "#f7f4fd", label: "#8b6dc8" },
};

/* assign stable accent based on note id */
const getAccent = (id) => ACCENTS[parseInt(id.slice(-2), 16) % ACCENTS.length];

/* ══════════════════════════════════════════════ */
const Notes = () => {
  const { searchQuery = "" } = useAuth();

  const [notes,   setNotes]   = useState([]);
  const [title,   setTitle]   = useState("");
  const [content, setContent] = useState("");
  const [interim, setInterim] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);

  const [editingNote,  setEditingNote]  = useState(null);
  const [editTitle,    setEditTitle]    = useState("");
  const [editContent,  setEditContent]  = useState("");
  const [editInterim,  setEditInterim]  = useState("");

  const [summaryNote,    setSummaryNote]    = useState(null);
  const [summaryText,    setSummaryText]    = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  /* ── FETCH ── */
  const fetchNotes = useCallback(async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  /* ── ADD ── */
  const addNote = async () => {
    const t = title.trim();
    if (!t || adding) return;
    setAdding(true);
    try {
      await API.post("/notes", { title: t, content: content.trim(), pinned: false });
      setTitle(""); setContent(""); setInterim("");
      await fetchNotes();
    } catch (err) {
      console.error("Add note error:", err?.response?.data || err.message);
      alert("❌ Could not save note.\nMake sure your backend is running on port 5050.");
    } finally {
      setAdding(false);
    }
  };

  /* ── DELETE ── */
  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  /* ── PIN ── */
  const togglePin = async (note) => {
    await API.put(`/notes/${note._id}`, { pinned: !note.pinned });
    fetchNotes();
  };

  /* ── EDIT ── */
  const openEdit = (note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content || "");
    setEditInterim("");
  };
  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    await API.put(`/notes/${editingNote._id}`, {
      title: editTitle.trim(),
      content: editContent.trim(),
    });
    setEditingNote(null);
    fetchNotes();
  };

  /* ── SUMMARISE ── */
  const openSummary = async (note) => {
    setSummaryNote(note);
    setSummaryText(""); setSummaryLoading(true);
    try {
      const text = await summariseNote(note.title, note.content);
      setSummaryText(text);
    } catch {
      setSummaryText("Error generating summary. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  /* ── FILTER ── */
  const q = searchQuery.toLowerCase();
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    (n.content || "").toLowerCase().includes(q)
  );
  const pinned = filtered.filter(n =>  n.pinned);
  const others = filtered.filter(n => !n.pinned);

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", padding: "40px 32px 80px", maxWidth: "1160px", margin: "0 auto" }}>

      {/* ════════════════ COMPOSE BOX ════════════════ */}
      <div className="compose-box page-enter" style={{ maxWidth: "580px", margin: "0 auto 52px" }}>

        {/* tiny label */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          marginBottom: "14px",
        }}>
          <span style={{ fontSize: "1.2rem" }}>✏️</span>
          <span style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: "0.62rem", letterSpacing: "0.2em",
            color: "#a89880", textTransform: "uppercase",
          }}>New Note</span>
        </div>

        <input
          className="input-paper"
          style={{ fontSize: "1.1rem", fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: "12px" }}
          placeholder="Give it a title…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && document.getElementById("note-body")?.focus()}
        />

        <textarea
          id="note-body"
          className="textarea-paper"
          rows={4}
          placeholder="Start writing here, or use the mic to dictate…"
          value={content + interim}
          onChange={e => { setContent(e.target.value); setInterim(""); }}
          style={{ fontSize: "0.95rem" }}
        />

        {interim && (
          <p style={{
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            color: "rgba(232,99,122,0.55)", fontSize: "0.88rem", marginTop: "4px",
          }}>
            🎤 {interim}
          </p>
        )}

        <div className="divider" style={{ marginTop: "14px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* voice */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <VoiceButton
              onResult={t  => { setContent(p => p ? p + " " + t : t); setInterim(""); }}
              onInterim={t => setInterim(t)}
            />
            <span style={{
              fontFamily: "'Fira Code', monospace", fontSize: "0.6rem",
              color: "#d4c8b8", letterSpacing: "0.12em",
            }}>VOICE</span>
          </div>

          {/* char count + add button */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {content.length > 0 && (
              <span style={{ fontFamily: "'Fira Code', monospace", fontSize: "0.65rem", color: "#d4c8b8" }}>
                {content.length} chars
              </span>
            )}
            <button
              onClick={addNote}
              disabled={!title.trim() || adding}
              className="btn-rose"
              style={{
                padding: "10px 26px", borderRadius: "100px",
                fontSize: "0.9rem", fontWeight: 600,
                opacity: title.trim() && !adding ? 1 : 0.45,
                cursor: title.trim() && !adding ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              {adding ? <><div className="spinner" style={{ borderTopColor: "#fff", width: 14, height: 14 }} /> Saving…</> : "+ Add Note"}
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════ LOADING ════════════════ */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", alignItems: "center", paddingTop: "60px" }}>
          <div className="spinner" style={{ width: 28, height: 28 }} />
          <span style={{ color: "#a89880", fontStyle: "italic", fontSize: "0.9rem" }}>Loading your notes…</span>
        </div>
      )}

      {/* ════════════════ PINNED ════════════════ */}
      {pinned.length > 0 && (
        <section style={{ marginBottom: "40px" }}>
          <p className="section-label">📌 Pinned</p>
          <NoteGrid notes={pinned} onEdit={openEdit} onDelete={deleteNote} onPin={togglePin} onSummary={openSummary} />
        </section>
      )}

      {/* ════════════════ OTHERS ════════════════ */}
      {others.length > 0 && (
        <section>
          {pinned.length > 0 && <p className="section-label">All Notes</p>}
          <NoteGrid notes={others} onEdit={openEdit} onDelete={deleteNote} onPin={togglePin} onSummary={openSummary} />
        </section>
      )}

      {/* ════════════════ EMPTY ════════════════ */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", paddingTop: "80px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px", animation: "float-up 3s ease-in-out infinite" }}>
            {searchQuery ? "🔍" : "🌸"}
          </div>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: "1.3rem", color: "#a89880",
          }}>
            {searchQuery ? `No notes matching "${searchQuery}"` : "Your notebook is empty. Begin writing something beautiful."}
          </p>
        </div>
      )}

      {/* ════════════════ EDIT MODAL ════════════════ */}
      {editingNote && (
        <div className="modal-overlay" onClick={() => setEditingNote(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <span style={{ fontSize: "1.1rem" }}>✏️</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#2c2416" }}>
                Edit Note
              </h3>
            </div>

            <input
              className="input-field"
              style={{ marginBottom: "14px", fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600 }}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              className="input-field"
              rows={5}
              value={editContent + editInterim}
              onChange={e => { setEditContent(e.target.value); setEditInterim(""); }}
              style={{ resize: "vertical", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.925rem", lineHeight: 1.7 }}
              placeholder="Note content…"
            />

            {editInterim && (
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "rgba(232,99,122,0.5)", fontSize: "0.875rem", marginTop: "6px" }}>
                🎤 {editInterim}
              </p>
            )}

            <div className="divider" style={{ marginTop: "16px" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <VoiceButton
                onResult={t => { setEditContent(p => p ? p + " " + t : t); setEditInterim(""); }}
                onInterim={t => setEditInterim(t)}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setEditingNote(null)} className="btn-ghost"
                  style={{ padding: "9px 20px", borderRadius: "100px", fontSize: "0.875rem" }}>
                  Cancel
                </button>
                <button onClick={saveEdit} className="btn-rose"
                  style={{ padding: "9px 24px", borderRadius: "100px", fontSize: "0.875rem" }}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ SUMMARY MODAL ════════════════ */}
      {summaryNote && (
        <div className="modal-overlay" onClick={() => setSummaryNote(null)}>
          <div className="modal-box" style={{ maxWidth: "460px" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <p style={{ fontFamily: "'Fira Code', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#a89880", marginBottom: "6px" }}>
                  ✨ AI SUMMARY
                </p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#2c2416", fontStyle: "italic" }}>
                  {summaryNote.title}
                </h3>
              </div>
              <button onClick={() => setSummaryNote(null)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#a89880", fontSize: "1.3rem", lineHeight: 1, padding: "4px",
              }}>×</button>
            </div>

            <div className="divider" />

            {summaryLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "24px 0" }}>
                <div className="spinner" />
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#a89880", fontSize: "0.925rem" }}>
                  Reading your note…
                </span>
              </div>
            ) : (
              <div className="summary-card" style={{ marginTop: "12px" }}>{summaryText}</div>
            )}

            {summaryNote.content && !summaryLoading && (
              <>
                <div className="divider" style={{ marginTop: "16px" }} />
                <details style={{ cursor: "pointer" }}>
                  <summary style={{
                    fontFamily: "'Fira Code', monospace", fontSize: "0.65rem",
                    color: "#a89880", letterSpacing: "0.1em", listStyle: "none",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                    <span>▸</span> View original note
                  </summary>
                  <p style={{
                    marginTop: "12px", color: "#6b5a46",
                    fontSize: "0.875rem", lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    {summaryNote.content}
                  </p>
                </details>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── GRID ─── */
const NoteGrid = ({ notes, onEdit, onDelete, onPin, onSummary }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "18px",
  }}>
    {notes.map((note, i) => (
      <NoteCard key={note._id} note={note} index={i}
        onEdit={onEdit} onDelete={onDelete} onPin={onPin} onSummary={onSummary} />
    ))}
  </div>
);

/* ─── CARD ─── */
const NoteCard = ({ note, index, onEdit, onDelete, onPin, onSummary }) => {
  const [hovered, setHovered] = useState(false);
  const accent = getAccent(note._id);
  const accentStyle = ACCENT_COLORS[accent];

  const date = new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div
      className={`note-card ${accent}${note.pinned ? " pinned" : ""}`}
      style={{ animation: `cardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.055}s both` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* PIN */}
      <button onClick={() => onPin(note)} title={note.pinned ? "Unpin" : "Pin"} style={{
        position: "absolute", top: "12px", right: "12px",
        background: "none", border: "none", cursor: "pointer",
        fontSize: "0.9rem",
        opacity: hovered || note.pinned ? 1 : 0.2,
        transition: "opacity 0.2s, transform 0.2s",
        transform: hovered ? "scale(1.15)" : "scale(1)",
      }}>
        {note.pinned ? "📌" : "📍"}
      </button>

      {/* TITLE */}
      <h4
        onClick={() => onEdit(note)}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.1rem", fontWeight: 600,
          color: "#2c2416", marginBottom: "8px",
          paddingRight: "28px",
          cursor: "pointer",
          lineHeight: 1.35,
          transition: "color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = accentStyle.label}
        onMouseLeave={e => e.currentTarget.style.color = "#2c2416"}
      >
        {note.title}
      </h4>

      {/* CONTENT */}
      {note.content && (
        <p onClick={() => onEdit(note)} style={{
          color: "#6b5a46", fontSize: "0.875rem", lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          display: "-webkit-box", WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          cursor: "pointer", marginBottom: "14px",
        }}>
          {note.content}
        </p>
      )}

      {/* DATE */}
      <p style={{
        fontFamily: "'Fira Code', monospace", fontSize: "0.62rem",
        color: "#d4c8b8", letterSpacing: "0.06em", marginBottom: "12px",
      }}>
        {date}
      </p>

      {/* DIVIDER */}
      <div className="divider" />

      {/* ACTIONS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {/* Edit */}
          <CardAction onClick={() => onEdit(note)} color={accentStyle.label} bg={accentStyle.bg} label="Edit" icon={
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          } />
          {/* Summarise */}
          <CardAction onClick={() => onSummary(note)} color="#8b6dc8" bg="#f7f4fd" label="Summary" icon={
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          } />
        </div>

        {/* Delete */}
        <button onClick={() => onDelete(note._id)} title="Delete" style={{
          background: "none", border: "none", cursor: "pointer",
          color: hovered ? "#e8637a" : "#d4c8b8",
          transition: "color 0.2s, transform 0.2s",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          display: "flex", alignItems: "center", padding: "4px",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

const CardAction = ({ onClick, color, bg, label, icon }) => {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? bg : "transparent",
        border: `1px solid ${h ? color + "40" : "rgba(44,36,22,0.1)"}`,
        borderRadius: "8px", color: h ? color : "#a89880",
        cursor: "pointer", padding: "5px 9px",
        display: "flex", alignItems: "center", gap: "5px",
        fontSize: "0.72rem", fontFamily: "'Fira Code', monospace",
        letterSpacing: "0.04em", transition: "all 0.18s",
      }}>
      {icon}{label}
    </button>
  );
};

export default Notes;