import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerAdmin = async (req, res) => {
    try {
        // SECURITY FIX: Sirf pehli baar register allow karo, baad me block
        const [allAdmins] = await pool.query('SELECT id FROM admins LIMIT 1');
        if (allAdmins.length > 0) {
            return res.status(403).json({ success: false, message: 'Registration disabled! Admin already exists.' });
        }

        const { username, email, password } = req.body;
        if (!username ||!email ||!password) {
            return res.status(400).json({ success: false, message: 'All fields are required!' });
        }

        const [existing] = await pool.query('SELECT * FROM admins WHERE email =? OR username =?', [email, username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Admin already exists!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query('INSERT INTO admins (username, email, password) VALUES (?,?,?)', [username, email, hashedPassword]);

        res.status(201).json({ success: true, message: 'Admin registered!', adminId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email ||!password) {
            return res.status(400).json({ success: false, message: 'Email and password required!' });
        }

        const [rows] = await pool.query('SELECT * FROM admins WHERE email =?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password!' });
        }

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password!' });
        }

        const token = jwt.sign(
            { id: rows[0].id, email: rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            admin: { id: rows[0].id, username: rows[0].username, email: rows[0].email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};