import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import db from "../config/db.js";

const router = express.Router();

// ✅ 1. Upload folders banao
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
ensureDir("uploads/profiles");
ensureDir("uploads/resumes");

// ✅ 2. Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_image") {
      cb(null, "uploads/profiles/");
    } else if (file.fieldname === "resume") {
      cb(null, "uploads/resumes/");
    } else {
      cb(null, "uploads/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
  },
});

const upload = multer({ storage });

// Dono files ek sath handle karne ke liye
const uploadFields = upload.fields([
  { name: "profile_image", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

// GET /api/hero
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hero ORDER BY id DESC LIMIT 1");
    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }
    let data = rows[0];
    // Full URL banao taaki frontend pe dikhe
    if (data.profile_image_url && !data.profile_image_url.startsWith("http") && !data.profile_image_url.startsWith("data:")) {
      data.profile_image_url = `${req.protocol}://${req.get("host")}${data.profile_image_url}`;
    }
    if (data.resume_url && !data.resume_url.startsWith("http")) {
      data.resume_url = `${req.protocol}://${req.get("host")}${data.resume_url}`;
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/hero - ✅ FIXED with file upload
router.post("/", uploadFields, async (req, res) => {
  try {
    let { title, subtitle, short_bio, resume_url, profile_image_url } = req.body;

    if (!title || !subtitle || !short_bio) {
      return res.status(400).json({ success: false, message: "Title, Subtitle, Short Bio required!" });
    }

    // ✅ File aayi hai to uska path lo
    if (req.files && req.files.profile_image) {
      profile_image_url = `/uploads/profiles/${req.files.profile_image[0].filename}`;
    }
    if (req.files && req.files.resume) {
      resume_url = `/uploads/resumes/${req.files.resume[0].filename}`;
    }

    const [result] = await db.query(
      `INSERT INTO hero (title, subtitle, short_bio, resume_url, profile_image_url) VALUES (?,?,?,?,?)`,
      [title, subtitle, short_bio, resume_url, profile_image_url]
    );
    const [row] = await db.query("SELECT * FROM hero WHERE id=?", [result.insertId]);
    res.json({ success: true, data: row[0], message: "Hero created!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/hero/:id - ✅ FIXED with file upload
router.put("/:id", uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    let { title, subtitle, short_bio, resume_url, profile_image_url } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "ID required" });

    const [existing] = await db.query("SELECT * FROM hero WHERE id=?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Hero not found" });
    }

    // ✅ Agar nayi file aayi hai to nayi, warna purani hi rakho
    if (req.files && req.files.profile_image) {
      profile_image_url = `/uploads/profiles/${req.files.profile_image[0].filename}`;
    } else {
      profile_image_url = profile_image_url || existing[0].profile_image_url;
    }
    if (req.files && req.files.resume) {
      resume_url = `/uploads/resumes/${req.files.resume[0].filename}`;
    } else {
      resume_url = resume_url || existing[0].resume_url;
    }

    await db.query(
      `UPDATE hero SET title=?, subtitle=?, short_bio=?, resume_url=?, profile_image_url=? WHERE id=?`,
      [title, subtitle, short_bio, resume_url, profile_image_url, id]
    );

    const [updated] = await db.query("SELECT * FROM hero WHERE id=?", [id]);
    res.json({ success: true, data: updated[0], message: "Hero updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/hero/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM hero WHERE id=?", [id]);
    res.json({ success: true, message: "Hero deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;