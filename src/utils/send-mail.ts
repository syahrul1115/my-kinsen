import { MailtrapClient } from "mailtrap"

const client = new MailtrapClient({
    token: process.env.MAILTRAP_CLIENT_TOKEN!
})

const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
};

export async function sendMail({ to, subject, text } :{ to: string; subject: string; text: string; }) {
    const sendResponse = await client.send({
        from: sender,
        to: [{ email: to }],
        subject: subject,
        text: text,
        category: "Integration Test",
    })

    return sendResponse;
}
