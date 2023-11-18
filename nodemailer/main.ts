import nodemailer from "nodemailer";
import fs from "fs";
import "dotenv/config";
import { coreTeam } from "./data";

async function main() {
  var email = coreTeam;
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

  const templatePath = "./coreemail.html"; // Replace with the actual path to your HTML template
  const emailTemplate = fs.readFileSync(templatePath, "utf-8");
  const subject = "Welcome to KMUTT GDSC Core Team!";
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
      const info = await transporter.sendMail(mailOptions as any);
      console.log("Email sent:", email[i]);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

main();
