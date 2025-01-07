import nodemailer from 'nodemailer';
export async function sendEmail(recipientEmail, downloadLink, shopName) {
    // console.log('Sending email to:', recipientEmail);
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: recipientEmail,
        subject: `Download your Bill from the Store ${shopName}`,
        text: `Here is your downloadable Bill: ${downloadLink}`,
    };

  const response=  await transporter.sendMail(mailOptions);
  console.log('Email sent:', response);
  
    return response;
}
