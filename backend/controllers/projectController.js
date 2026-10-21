import pool from "../config/db.js";

export const getAllProjects = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.log("Error fetching projects:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createProject = async (req, res) => {
  try {
    let { title, description, tech_stack, github_link, live_link, image_url } = req.body;

    if (!title || !description || !tech_stack) {
      return res.status(400).json({ success: false, message: "Title, Description, Tech Stack required!" });
    }

    // ✅ Agar image upload hui hai to uska path save karo
    if (req.file) {
      image_url = `/uploads/projects/${req.file.filename}`;
    }

    const query = "INSERT INTO projects (title, description, tech_stack, github_link, live_link, image_url) VALUES (?,?,?,?,?,?)";
    const [result] = await pool.query(query, [title, description, tech_stack, github_link || "", live_link || "", image_url || ""]);

    const [newRow] = await pool.query("SELECT * FROM projects WHERE id=?", [result.insertId]);
    res.status(201).json({ success: true, message: "Project created", data: newRow[0] });
  } catch (error) {
    console.log("Error creating project:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, tech_stack, github_link, live_link, image_url } = req.body;

    const [existing] = await pool.query("SELECT * FROM projects WHERE id=?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found!" });
    }

    if (req.file) {
      image_url = `/uploads/projects/${req.file.filename}`;
    } else {
      image_url = image_url || existing[0].image_url;
    }

    const query = "UPDATE projects SET title=?, description=?, tech_stack=?, github_link=?, live_link=?, image_url=? WHERE id=?";
    await pool.query(query, [title, description, tech_stack, github_link, live_link, image_url, id]);

    const [updated] = await pool.query("SELECT * FROM projects WHERE id=?", [id]);
    res.status(200).json({ success: true, message: "Project updated", data: updated[0] });
  } catch (error) {
    console.log("Error updating:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM projects WHERE id=?", [id]);
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};