import nodemailer from "nodemailer";
import fs from "fs";
import dotenv from "dotenv";
import { muaymi } from "./data";

async function main() {
  var email = muaymi;
  dotenv.config();
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST;

  const transporter = nodemailer.createTransport({
    port: 465,
    host: host,
    auth: {
      user: user,
      pass: password,
    },
  });

  const templatePath = "./emailmuay.html"; // Replace with the actual path to your HTML template
  const emailTemplate = fs.readFileSync(templatePath, "utf-8");
  const subject = "Welcome to KMUTT GDSC Na Muaymi !";
  for (var i = 0; i < email.length; i++) {
    const htmlContent = emailTemplate;

    const mailOptions = {
      from: user,
      to: email[i],
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.jpg",
          path: "./logo.jpg",
          cid: "gdscLogo",
        },
      ],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", email[i]);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

main();
