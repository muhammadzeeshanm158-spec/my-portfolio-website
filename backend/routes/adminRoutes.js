import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/admins/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email ||!password) {
      return res.status(400).json({ success: false, message: "Email and password required!" });
    }

    const [rows] = await pool.query("SELECT * FROM admins WHERE email =?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found! Please create first." });
    }

    const admin = rows[0];

    // Agar password hash hai to bcrypt compare, warna direct (dev ke liye)
    let isMatch = false;
    if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, admin.password);
    } else {
      isMatch = password === admin.password;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password!" });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || "zeeshan_secret_123", { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful!",
      token,
      admin: { id: admin.id, email: admin.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admins - check
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT id, email, created_at FROM admins");
  res.json({ success: true, data: rows });
});

export default router;