import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import fs from "fs";

import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import educationRoutes from './routes/educationRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// ✅ FIX: contactRoutes hata diya kyunki tum password nahi dena chahte - Web3Forms se email jayega

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many login attempts, try after 15 min!" }
});

// ✅ YE SAB FOLDERS BANAO - Ye missing tha!
const baseUpload = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(baseUpload)) fs.mkdirSync(baseUpload, { recursive: true });
if (!fs.existsSync(path.join(baseUpload, 'projects'))) fs.mkdirSync(path.join(baseUpload, 'projects'), { recursive: true });
if (!fs.existsSync(path.join(baseUpload, 'profiles'))) fs.mkdirSync(path.join(baseUpload, 'profiles'), { recursive: true }); // ✅ FIX: hero ki jagah profiles
if (!fs.existsSync(path.join(baseUpload, 'resumes'))) fs.mkdirSync(path.join(baseUpload, 'resumes'), { recursive: true });
// ✅ FIX: hero folder hata diya, profiles add kiya - heroRoutes me profiles use ho raha hai

// ✅ Static - Is line ko sab routes se UPAR rakho
app.use('/uploads', express.static(baseUpload));

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin/login", loginLimiter);
app.use("/api/admins/login", loginLimiter);

app.use("/api/projects", projectRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/experience", experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/educations', educationRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/heros', heroRoutes);
app.use('/api/social-links', socialRoutes);
app.use('/api/social-link', socialRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admins', adminRoutes);
// ✅ FIX: Ye line hata di hai - CEO ka form ab Web3Forms se email bhejega, bina password ke

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Portfolio Backend!",
        uploads: `${req.protocol}://${req.get('host')}/uploads/`
    });
});

// 404 handler
app.use((req, res) => {
    console.log("404 for:", req.originalUrl); // ✅ Debug ke liye
    res.status(404).json({ success: false, message: "Route not found!" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
});

export default app;