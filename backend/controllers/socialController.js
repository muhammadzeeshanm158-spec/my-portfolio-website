import pool from '../config/db.js';

export const getAllSocials = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM social_links ORDER BY id DESC');
    res.json({ data: rows });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createSocial = async (req, res) => {
  try {
    // FIX: Frontend se jo naam aaye usko table ke naam pe map karo
    let { platform_name, platform, profile_url, url, icon_class, icon } = req.body;

    platform_name = platform_name || platform;
    profile_url = profile_url || url;
    icon_class = icon_class || icon || '';

    if (!platform_name ||!profile_url) {
      return res.status(400).json({ message: 'platform_name and profile_url required!' });
    }

    const [result] = await pool.query(
      'INSERT INTO social_links (platform_name, profile_url, icon_class) VALUES (?,?,?)',
      [platform_name, profile_url, icon_class]
    );
    res.status(201).json({ message: 'Added', id: result.insertId });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updateSocial = async (req, res) => {
  try {
    let { platform_name, platform, profile_url, url, icon_class, icon } = req.body;
    platform_name = platform_name || platform;
    profile_url = profile_url || url;
    icon_class = icon_class || icon || '';

    await pool.query(
      'UPDATE social_links SET platform_name=?, profile_url=?, icon_class=? WHERE id=?',
      [platform_name, profile_url, icon_class, req.params.id]
    );
    res.json({ message: 'Updated' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const deleteSocial = async (req, res) => {
  await pool.query('DELETE FROM social_links WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
};