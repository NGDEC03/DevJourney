
import { sendMail } from './sendMail';

export default function generateUserName(email: string): string {
   if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
   }
   let username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
   username = username.slice(0, 15).toLowerCase();
   const emailContent = {
      subject: "Welcome to DevJourney! Your Credentials",
      recipient: email,
      text: `Your username is ${username}.`,
      html: `
         <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="color: #4CAF50;">Welcome to DevJourney!</h2>
            <p>Hi there,</p>
            <p>We're excited to have you on board. Here are your account credentials:</p>
            <div style="padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
               <p><strong>Username:</strong> ${username}</p>
            </div>
            <p>You can now log in and start exploring our platform.</p>
            <p style="color: #555;">If you have any questions, feel free to reach out to our support team.</p>
            <p style="margin-top: 20px;">Cheers,</p>
            <p>The DevJourney Team</p>
         </div>
      `,
   };

   sendMail(emailContent)
   return username
}


