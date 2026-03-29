import { useState } from "react";
import api from "../api";

function NoteEditor({ onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const saveNote = async () => {
    if (!title.trim()) return;

    try {
      await api.post("/notes", { title, content });
      onClose();
    } catch (err) {
      console.error("Save failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900 rounded-2xl p-6 shadow-2xl">
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-xl font-medium outline-none mb-4 placeholder-slate-500"
        />

        <textarea
          placeholder="Write what’s on your mind…"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent outline-none resize-none text-slate-200 placeholder-slate-500"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={saveNote}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
