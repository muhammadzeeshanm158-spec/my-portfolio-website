import express from "express";
import { getAllEducation, createEducation, updateEducation, deleteEducation } from "../controllers/educationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get('/', getAllEducation);

// Protected
router.post('/', protect, createEducation);
router.put('/:id', protect, updateEducation); // ✅ YE ADD KIYA - EDIT ke liye
router.delete('/:id', protect, deleteEducation);

// ✅ Agar protect se Route not found aaye to testing ke liye ye try karo:
// router.post('/', createEducation);
// router.put('/:id', updateEducation);
// router.delete('/:id', deleteEducation);

export default router;