const nodemailer = require("nodemailer");
require("dotenv").config();

// Transporte for email configuration
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports = transporter;
