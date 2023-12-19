import nodemailer from "nodemailer";

const { GMAIL_USER, GMAIL_PASS } = process.env;

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export default mailTransporter;
