import pool from '../config/db.js';

// 1. GET All Messages Controller: Portfolio admin panel ke liye visitors ke saare contact messages fetch karne ke liye (Newest message pehle aayega DESC order mein)
export const getAllMessages = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages ORDER BY id DESC');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 2. Create Message Controller: Portfolio website ke contact form se visitor ka naya message database mein save karne ke liye (Public access)
export const createMessage = async (req, res) => {
    try {
        // ✅ FIX: Ab dono naam accept karega - name/sender_name aur email/sender_email
        const { sender_name, sender_email, name, email, subject, message } = req.body;
        const finalName = sender_name || name;
        const finalEmail = sender_email || email;

        // Validation: Check karte hain ki zaroori fields (name, email, aur message) provide ki gayi hain ya nahi
        if (!finalName || !finalEmail || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and message are required!' 
            });
        }

        const query = 'INSERT INTO messages (sender_name, sender_email, subject, message) VALUES (?, ?, ?, ?)';
        // Agar subject provide nahi kiya gaya ho toh null store karenge
        const [result] = await pool.query(query, [finalName, finalEmail, subject || null, message]);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            messageId: result.insertId
        });
    } catch (error) {
        console.error('Error creating message:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 3. Delete Message Controller: Kisi specific message ko read karne ke baad admin panel se remove karne ke liye (Admin protected)
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        // Pehle check karte hain ki yeh message database mein exist karta hai ya nahi
        const [existing] = await pool.query('SELECT * FROM messages WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Message not found!' });
        }

        // Agar message mil jaye, toh use delete kar do
        await pool.query('DELETE FROM messages WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting message:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};