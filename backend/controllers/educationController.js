import pool from "../config/db.js";

// 1. GET All Education
export const getAllEducation = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM education ORDER BY id DESC");
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.log("Error fetching education:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. Create Education
export const createEducation = async (req, res) => {
  try {
    const { degree, institution, start_year, end_year, description } = req.body;
    if (!degree || !institution || !start_year || !end_year || !description) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }
    if (isNaN(start_year) || isNaN(end_year)) {
      return res.status(400).json({ success: false, message: "Start and End year must be numbers!" });
    }
    const query = "INSERT INTO education (degree, institution, start_year, end_year, description) VALUES (?,?,?,?,?)";
    const [result] = await pool.query(query, [degree, institution, start_year, end_year, description]);
    res.status(201).json({ success: true, message: "Education created", data: { id: result.insertId } });
  } catch (error) {
    console.log("Error creating education:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. ✅ NEW: Update / Edit Education - YE MISSING THA!
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, institution, start_year, end_year, description } = req.body;

    if (!degree || !institution || !start_year || !end_year || !description) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const [existing] = await pool.query("SELECT id FROM education WHERE id =?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Education entry not found!" });
    }

    const query = "UPDATE education SET degree=?, institution=?, start_year=?, end_year=?, description=? WHERE id=?";
    await pool.query(query, [degree, institution, start_year, end_year, description, id]);

    const [updated] = await pool.query("SELECT * FROM education WHERE id=?", [id]);
    res.status(200).json({ success: true, message: "Education updated successfully", data: updated[0] });
  } catch (error) {
    console.log("Error updating education:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 4. Delete Education
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT id FROM education WHERE id =?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Education entry not found!" });
    }
    await pool.query("DELETE FROM education WHERE id =?", [id]);
    res.status(200).json({ success: true, message: "Education deleted successfully" });
  } catch (error) {
    console.log("Error deleting education:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};