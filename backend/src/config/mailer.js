import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const defaultFrom =
  process.env.EMAIL_FROM || "SportifyClub <no-reply@sportifyclub.com>";

export const sendMail = async ({ to, subject, html, text }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "No se han configurado los datos SMTP. Revisa SMTP_HOST, SMTP_USER y SMTP_PASS.",
    );
  }

  return transporter.sendMail({
    from: defaultFrom,
    to,
    subject,
    html,
    text,
  });
};
