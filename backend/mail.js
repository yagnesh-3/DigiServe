require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587, // Use 465 for SSL
    secure: false, // Set true if using port 465
    auth: {
        user: "golakoti.12224152@lpu.in",
        pass: "Yagnesh@2004",
    },
});

const mailOptions = {
    from: "golakoti.12224152@lpu.in",
    to: "psaisuryacharan@gmail.com",
    subject: "hi sanket test",
    text: "Hello! This is a test email sent using Nodemailer.",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Email sent:", info.response);
    }
});
