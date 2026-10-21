import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
    getAllProjects,
    createProject,
    deleteProject,
    updateProject,
} from "../controllers/projectController.js";
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ ABSOLUTE PATH - Ye kabhi fail nahi hoga
const uploadPath = path.join(process.cwd(), "uploads", "projects");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("✅ Created folder:", uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + cleanName);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Routes
router.get("/", getAllProjects);
router.post("/", verifyToken, upload.single("project_image"), createProject);
router.put("/:id", verifyToken, upload.single("project_image"), updateProject);
router.delete("/:id", verifyToken, deleteProject);

export default router;