const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ======================
   CREATE NOTE
====================== */
router.post("/", auth, async (req, res) => {
  try {
    const note = await Note.create({
      user: req.userId,
      title: req.body.title,
      content: req.body.content,
      pinned: req.body.pinned || false,
    });

    res.json(note);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Create failed" });
  }
});

/* ======================
   GET ALL NOTES
====================== */
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId })
      .sort({ pinned: -1, createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ======================
   UPDATE NOTE
====================== */
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        title: req.body.title,
        content: req.body.content,
        pinned: req.body.pinned,
      },
      { new: true }
    );

    res.json(note);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ======================
   DELETE NOTE
====================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
