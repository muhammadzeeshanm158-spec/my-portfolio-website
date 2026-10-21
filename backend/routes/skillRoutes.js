import express from "express";
import { getAllSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js'; // ya verifyToken, jo bhi apne banaya hai

const router = express.Router();

// 1. GET Route: Portfolio visitors ke liye saari skills ki list fetch karne ke liye (Public access)
router.get("/", getAllSkills);

// 2. POST Route: Nayi skill database mein add karne ke liye (Admin protected)
router.post("/", protect, createSkill);

// 3. PUT Route: Existing skill ko update karne ke liye (Admin protected) - EDIT ke liye zaruri hai
router.put("/:id", protect, updateSkill);

// 4. DELETE Route: Kisi specific skill ko uski unique ID ke zariye remove karne ke liye (Admin protected)
router.delete("/:id", protect, deleteSkill);

export default router;