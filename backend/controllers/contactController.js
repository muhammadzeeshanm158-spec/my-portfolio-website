const nodemailer = require('nodemailer');
const Message = require('../models/Message'); // 👈 agar tumhara message model hai

exports.sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // ✅ Validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields required!" });
  }

  try {
    // ✅ 1. Pehle Admin Panel ke liye DB me save karo
    try {
      await Message.create({ name, email, subject, message });
    } catch (dbErr) {
      console.log("DB save failed, but continue email:", dbErr.message);
    }

    // ✅ 2. Phir Gmail pe email bhejo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // muhammadzeeshanm158@gmail.com
        pass: process.env.EMAIL_PASS,  // 👈 Ye MAIN password nahi, App Password hai (safe hai)
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Lead" <${process.env.EMAIL_USER}>`,
      to: process.env.MY_EMAIL, // muhammadzeeshanm158@gmail.com pe ayega
      replyTo: email, // CEO ka email, taaki tum direct reply kar sako
      subject: `🚀 New Lead: ${name} - ${subject || 'Portfolio Inquiry'}`,
      html: `
        <div style="font-family: Arial; background: #f9f9f9; padding: 20px;">
          <div style="background: white; padding: 20px; border-radius: 10px;">
            <h2>New Message from Portfolio</h2>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Subject:</b> ${subject}</p>
            <p><b>Message:</b></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</div>
          </div>
        </div>
      `
    });

    res.json({ success: true, message: "Message sent & saved!" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};