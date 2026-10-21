import pool from "../config/db.js";

// 1. GET All Skills Controller: Portfolio visitors ke liye database se saari skills ki list fetch karne ke liye (Public access)
export const getAllSkills = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM skills ORDER BY id DESC");
    res.status(200).json({
      success: true,
      message: "get all skills fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching skills",
    });
  }
};

// Alias for routes that use getSkills name
export const getSkills = getAllSkills;

// 2. Create Skill Controller: Nayi technical ya soft skill database mein add karne ke liye (Admin protected)
export const createSkill = async (req, res) => {
    try {
        // FIXED: Table ke columns ke hisab se - skill_name, category, icon_url, proficiency_level
        let { skill_name, name, proficiency_level, proficiency, category, icon_url } = req.body;

        // Support both names: skill_name OR name, proficiency_level OR proficiency
        const finalSkillName = skill_name || name;
        let finalProficiency = proficiency_level?? proficiency?? 80;

        // Validation: Check karte hain ki skill ka naam provide kiya gaya hai ya nahi
        if (!finalSkillName ||!finalSkillName.trim()) {
            return res.status(400).json({ success: false, message: 'Skill name is required!' });
        }
        if (!category ||!category.trim()) {
            return res.status(400).json({ success: false, message: 'Category is required!' });
        }

        // FIXED: Proficiency ko INT me convert karo
        finalProficiency = parseInt(finalProficiency);
        if (isNaN(finalProficiency)) finalProficiency = 80;
        if (finalProficiency < 0 || finalProficiency > 100) {
            return res.status(400).json({ success: false, message: 'Proficiency must be 0-100' });
        }

        // FIXED: Correct column names - skill_name, category, icon_url, proficiency_level
        const query = 'INSERT INTO skills (skill_name, category, icon_url, proficiency_level) VALUES (?,?,?,?)';
        const [result] = await pool.query(query, [finalSkillName.trim(), category.trim(), icon_url || null, finalProficiency]);

        const [newRow] = await pool.query('SELECT * FROM skills WHERE id=?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Skill added successfully!',
            data: newRow[0],
            skillId: result.insertId
        });
    } catch (error) {
        console.error('Error creating skill:', error.message);
        // ENUM error ke liye clear message
        if (error.message.includes('ENUM') || error.message.includes('Data truncated')) {
            return res.status(400).json({ success: false, message: 'Invalid category! Use: Frontend, Backend, Database, Tools, Other' });
        }
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

// 3. UPDATE Skill Controller: Skill update karne ke liye
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    let { skill_name, name, proficiency_level, proficiency, category, icon_url } = req.body;

    const finalSkillName = skill_name || name;
    let finalProficiency = proficiency_level?? proficiency?? 80;
    finalProficiency = parseInt(finalProficiency);
    if (isNaN(finalProficiency)) finalProficiency = 80;

    await pool.query(
      'UPDATE skills SET skill_name=?, category=?, icon_url=?, proficiency_level=? WHERE id=?',
      [finalSkillName.trim(), category.trim(), icon_url || null, finalProficiency, id]
    );

    const [updated] = await pool.query('SELECT * FROM skills WHERE id=?', [id]);

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully!',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating skill:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// 4. Delete Skill Controller: Kisi specific skill ko uski ID ke zariye database se remove karne ke liye (Admin protected)
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    // Pehle check karte hain ki yeh skill database mein exist karti hai ya nahi
    const [existing] = await pool.query("SELECT * FROM skills WHERE id =?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Skill not found!" });
    }

    // Agar skill mil jaye, toh use delete kar do
    await pool.query("DELETE FROM skills WHERE id =?", [id]);

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting skill:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};