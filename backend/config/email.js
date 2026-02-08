import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // change this
  port: 465,                  // or 587 for TLS
  secure: true,               // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((err, success) => {
  if (err) console.error("SMTP Connection Error ❌", err);
  else console.log("SMTP Connected ✅");
});

export default transporter;
