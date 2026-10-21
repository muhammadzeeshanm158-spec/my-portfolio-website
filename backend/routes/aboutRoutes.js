import express from "express";
import db from "../config/db.js";
const router = express.Router();

// GET /api/about
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM about ORDER BY id DESC LIMIT 1");
    res.json({ success: true, data: rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/about
router.post("/", async (req, res) => {
  try {
    const { heading, description, experience_years, completed_projects } = req.body;
    const [result] = await db.query(
      "INSERT INTO about (heading, description, experience_years, completed_projects) VALUES (?,?,?,?)",
      [heading, description, experience_years, completed_projects]
    );
    const [row] = await db.query("SELECT * FROM about WHERE id=?", [result.insertId]);
    res.json({ success: true, data: row[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/about/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, description, experience_years, completed_projects } = req.body;
    await db.query(
      "UPDATE about SET heading=?, description=?, experience_years=?, completed_projects=? WHERE id=?",
      [heading, description, experience_years, completed_projects, id]
    );
    const [row] = await db.query("SELECT * FROM about WHERE id=?", [id]);
    res.json({ success: true, data: row[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/about/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM about WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;