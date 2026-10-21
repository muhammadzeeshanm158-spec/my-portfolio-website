import express from "express";
import { 
  getAllExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience 
} from "../controllers/experienceController.js"; // <-- PATH CHECK KARO

const router = express.Router();

router.get("/", getAllExperiences);
router.post("/", createExperience);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);

export default router;