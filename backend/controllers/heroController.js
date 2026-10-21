import pool from '../config/db.js';

// 1. GET Hero
export const getHero = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hero LIMIT 1');
        let heroData = rows[0] || null;

        if (heroData) {
            // Resume URL ko full URL banao
            if (heroData.resume_url && !heroData.resume_url.startsWith('http') && !heroData.resume_url.startsWith('data:')) {
                heroData.resume_url = `${req.protocol}://${req.get('host')}${heroData.resume_url}`;
            }
            // Profile Image URL ko bhi full URL banao
            if (heroData.profile_image_url && !heroData.profile_image_url.startsWith('http') && !heroData.profile_image_url.startsWith('data:')) {
                heroData.profile_image_url = `${req.protocol}://${req.get('host')}${heroData.profile_image_url}`;
            }
        }

        res.status(200).json({ success: true, data: heroData });
    } catch (error) {
        console.error('Error fetching hero info:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 2. UPSERT Hero — FIXED for Profile Image
export const upsertHero = async (req, res) => {
    try {
        const { title, subtitle, short_bio } = req.body;
        let { resume_url, profile_image_url } = req.body;

        if (!title || !subtitle || !short_bio) {
            return res.status(400).json({ success: false, message: 'Title, subtitle, and short bio are required!' });
        }

        // ✅ FIX 1: Resume file check (agar field name 'resume' ya 'resume_file' ho)
        if (req.files && req.files.resume && req.files.resume[0]) {
            resume_url = `/uploads/resumes/${req.files.resume[0].filename}`;
        } else if (req.file && req.file.fieldname === 'resume') {
             resume_url = `/uploads/resumes/${req.file.filename}`;
        }

        // ✅ FIX 2: Profile Image file check (ye tum bhej rahe ho)
        if (req.files && req.files.profile_image && req.files.profile_image[0]) {
            profile_image_url = `/uploads/profiles/${req.files.profile_image[0].filename}`;
        } else if (req.files && req.files.profile_image_url) {
             profile_image_url = `/uploads/profiles/${req.files.profile_image_url[0].filename}`;
        } else if (req.file && req.file.fieldname === 'profile_image') {
            profile_image_url = `/uploads/profiles/${req.file.filename}`;
        }

        const [existing] = await pool.query('SELECT * FROM hero LIMIT 1');

        if (existing.length > 0) {
            const finalResumeUrl = resume_url || existing[0].resume_url;
            const finalProfileUrl = profile_image_url || existing[0].profile_image_url;

            const query = `UPDATE hero SET title =?, subtitle =?, short_bio =?, resume_url =?, profile_image_url =? WHERE id =?`;
            await pool.query(query, [title, subtitle, short_bio, finalResumeUrl, finalProfileUrl, existing[0].id]);

            res.status(200).json({ success: true, message: 'Hero section updated successfully!' });
        } else {
            const query = `INSERT INTO hero (title, subtitle, short_bio, resume_url, profile_image_url) VALUES (?,?,?,?,?)`;
            const [result] = await pool.query(query, [title, subtitle, short_bio, resume_url, profile_image_url]);

            res.status(201).json({ success: true, message: 'Hero section created successfully!', heroId: result.insertId });
        }
    } catch (error) {
        console.error('Error saving hero info:', error.message);
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

// ✅ EXTRA: Agar tumhare routes me PUT /hero/:id use ho raha hai to ye bhi add karo
export const updateHeroById = async (req, res) => {
    return upsertHero(req, res); // Same logic use hoga
};

export const createHero = async (req, res) => {
    return upsertHero(req, res);
};

export const deleteHero = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM hero WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'Deleted!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};