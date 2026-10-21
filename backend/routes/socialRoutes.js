import express from "express";
import { getAllSocials, createSocial, updateSocial, deleteSocial } from "../controllers/socialController.js";
const router = express.Router();

router.get("/", getAllSocials);
router.post("/", createSocial);
router.put("/:id", updateSocial);
router.delete("/:id", deleteSocial);

export default router;