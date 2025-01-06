import transporter from "./transporter";
interface mailProp {
    text: string, 
    subject: string, 
    recipient: string,
    html:string
}
export async function sendMail({ text, subject, recipient,html}:mailProp) {
    await transporter.sendMail({
        from: process.env.email,
        to: recipient,
        subject,
        text,
        html

    })
}