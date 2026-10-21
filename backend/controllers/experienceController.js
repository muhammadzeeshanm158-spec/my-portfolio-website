import pool from '../config/db.js';

// 1. GET All Experiences - Newest first
export const getAllExperiences = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM experience ORDER BY id DESC');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching experiences:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 2. CREATE Experience - Aapki SQL ke hisab se
export const createExperience = async (req, res) => {
    try {
        const { role, company_name, start_date, end_date, description, is_current } = req.body;

        if (!role ||!company_name ||!start_date) {
            return res.status(400).json({
                success: false,
                message: 'Role, company_name, and start_date are required!'
            });
        }

        // Agar is_current = true hai to end_date NULL hoga (aapki SQL ke hisab se)
        const finalEndDate = is_current? null : (end_date || null);

        const query = 'INSERT INTO experience (role, company_name, start_date, end_date, description) VALUES (?,?,?,?,?)';
        const [result] = await pool.query(query, [role, company_name, start_date, finalEndDate, description || null]);

        res.status(201).json({
            success: true,
            message: 'Experience added successfully!',
            experienceId: result.insertId
        });
    } catch (error) {
        console.error('Error creating experience:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. UPDATE Experience - YE MISSING THA, AB ADD KIYA
export const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, company_name, start_date, end_date, description, is_current } = req.body;

        const [existing] = await pool.query('SELECT * FROM experience WHERE id =?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Experience not found!' });
        }

        const finalEndDate = is_current? null : (end_date || null);

        const query = 'UPDATE experience SET role =?, company_name =?, start_date =?, end_date =?, description =? WHERE id =?';
        await pool.query(query, [role, company_name, start_date, finalEndDate, description, id]);

        res.status(200).json({
            success: true,
            message: 'Experience updated successfully!'
        });
    } catch (error) {
        console.error('Error updating experience:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 4. DELETE Experience
export const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.query('SELECT * FROM experience WHERE id =?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Experience not found!' });
        }

        await pool.query('DELETE FROM experience WHERE id =?', [id]);

        res.status(200).json({
            success: true,
            message: 'Experience deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting experience:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};