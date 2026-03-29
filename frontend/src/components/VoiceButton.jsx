import { useState, useRef, useEffect } from "react";

const VoiceButton = ({ onResult, onInterim, disabled }) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        e.results[i].isFinal ? (final += t) : (interim += t);
      }
      if (interim && onInterim) onInterim(interim);
      if (final && onResult) onResult(final);
    };
    rec.onerror = () => setListening(false);
    rec.onend   = () => setListening(false);
    recRef.current = rec;
    return () => rec.abort();
  }, []);

  const toggle = () => {
    if (!supported) return;
    if (listening) { recRef.current?.stop(); setListening(false); }
    else { try { recRef.current?.start(); setListening(true); } catch (_) {} }
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      title={listening ? "Stop recording" : "Voice input"}
      style={{
        width: "38px", height: "38px", borderRadius: "50%",
        border: `1.5px solid ${listening ? "rgba(232,99,122,0.6)" : "rgba(44,36,22,0.15)"}`,
        background: listening ? "rgba(232,99,122,0.08)" : "rgba(44,36,22,0.03)",
        color: listening ? "#e8637a" : "#a89880",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
        flexShrink: 0, position: "relative",
        boxShadow: listening ? "0 0 14px rgba(232,99,122,0.2)" : "none",
      }}
    >
      {listening ? (
        <span style={{ display: "flex", alignItems: "center", gap: "2px", height: "16px" }}>
          {[0.4, 0.8, 1, 0.8, 0.4].map((h, i) => (
            <span key={i} className="voice-bar"
              style={{ height: `${h * 14}px`, animationDelay: `${i * 0.1}s` }} />
          ))}
        </span>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      )}
      {listening && (
        <span style={{
          position: "absolute", inset: "-5px", borderRadius: "50%",
          border: "1.5px solid rgba(232,99,122,0.4)",
          animation: "ping-ring 1.2s ease-out infinite",
          pointerEvents: "none",
        }} />
      )}
    </button>
  );
};

export default VoiceButton;