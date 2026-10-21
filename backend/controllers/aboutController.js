import pool from '../config/db.js';

// 1. GET About - Single object return karo, array nahi
export const getAbout = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM about LIMIT 1');

        // Agar data nahi hai to null bhejo, empty array nahi
        const about = rows.length > 0? rows[0] : null;

        res.status(200).json({
            success: true,
            data: about
        });
    } catch (error) {
        console.error('Error fetching about:', error.message);
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

// 2. UPSERT About - Resume support bhi add kiya
export const upsertAbout = async (req, res) => {
    try {
        // FIXED: Sirf table ke columns liye - heading, description, experience_years, completed_projects
        const { heading, title, description, experience_years, completed_projects } = req.body;
        // Support both heading and title from frontend
        const finalHeading = heading || title;

        if (!finalHeading ||!description) {
            return res.status(400).json({ success: false, message: 'Title and description are required!' });
        }

        const [existing] = await pool.query('SELECT * FROM about LIMIT 1');

        if (existing.length > 0) {
            // FIXED: Table ke hisab se UPDATE - sirf 4 columns
            await pool.query(
              `UPDATE about SET heading =?, description =?, experience_years =?, completed_projects =? WHERE id =?`,
              [finalHeading, description, experience_years || 2, completed_projects || 15, existing[0].id]
            );
            const [updated] = await pool.query('SELECT * FROM about WHERE id=?', [existing[0].id]);
            res.status(200).json({ success: true, message: 'About updated successfully!', data: updated[0] });
        } else {
            // FIXED: Table ke hisab se INSERT - sirf 4 columns
            const [result] = await pool.query(
              `INSERT INTO about (heading, description, experience_years, completed_projects) VALUES (?,?,?,?)`,
              [finalHeading, description, experience_years || 2, completed_projects || 15]
            );
            const [newRow] = await pool.query('SELECT * FROM about WHERE id=?', [result.insertId]);
            res.status(201).json({ success: true, message: 'About created!', data: newRow[0], aboutId: result.insertId });
        }
    } catch (error) {
        console.error('Error saving about:', error.message);
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

export const deleteAbout = async (req, res) => {
    try {
        // ID se delete ya first record delete
        const id = req.params.id;
        if (id) {
            await pool.query('DELETE FROM about WHERE id =?', [id]);
        } else {
            // Agar id nahi to first record delete
            const [existing] = await pool.query('SELECT * FROM about LIMIT 1');
            if (existing.length > 0) {
                await pool.query('DELETE FROM about WHERE id=?', [existing[0].id]);
            }
        }
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};