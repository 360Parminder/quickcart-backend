import twilio from 'twilio';

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(recipientPhone, downloadLink) {
  const response=  await client.messages.create({
        body: `Your PDF is ready. Download it here: ${downloadLink}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${recipientPhone}`,
    });
    return response;

}
