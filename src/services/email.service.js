const transporter = require("../config/email.config");

// Send Email function for Sign Up
async function sendWelcomeEmail (to) {
    const mailOptions = {
        to,
        subject: 'Welcome to Sander RRHH!',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Account Created</title>
            </head>
            <body style="margin:0; font-family: Arial, sans-serif; background-color:#f4f4f4; padding:0;">
                <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:8px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#007bff; color:#ffffff; text-align:center; padding:20px 0;">
                            <h1 style="margin:0;">Sander RRHH</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px; color:#333333;">
                            <h2 style="margin-top:0;">Your Account Has Been Created!</h2>
                            <p style="font-size:16px; line-height:1.6;">
                                Hello 👋,<br>
                                We’re excited to let you know that your account has been successfully created.
                                You can now log in and start exploring all the features our app offers.
                            </p>
                            <div style="text-align:center; margin:30px 0;">
                                <a href="https://samuelconra.com/" style="background-color:#007bff; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold;">
                                    Log In
                                </a>
                            </div>
                            <p style="font-size:14px; color:#555;">
                                If you didn’t request this account, please ignore this email or contact our support team.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f4f4f4; text-align:center; padding:15px; font-size:12px; color:#888;">
                            © ${new Date().getFullYear()} Sander. All rights reserved.
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error while sending email:", error)
    }
        
}

module.exports = sendWelcomeEmail;
