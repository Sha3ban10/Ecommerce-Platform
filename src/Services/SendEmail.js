import { createTransport } from "nodemailer";

export const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "moha.sha3ban10@gmail.com",
    pass: "jgtghnkxmbisqzrn",
  },
});

export const sendEmail = async (to, subject, html, attachment = []) => {
  transporter.sendMail({
    to: to,
    subject: subject,
    html: html,
    attachment,
  });
};
