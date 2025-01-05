import nodemailer from 'nodemailer';

export async function sendEmail(recipientEmail, downloadLink) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: recipientEmail,
        subject: 'Your PDF is ready',
        text: `Here is your downloadable PDF: ${downloadLink}`,
    };

  const response=  await transporter.sendMail(mailOptions);
    return response;
}
