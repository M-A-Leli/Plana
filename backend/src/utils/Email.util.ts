import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PWD,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
}

const sendEmail = async ({ to, subject, template, context }: EmailOptions) => {
    const templatePath = path.join(__dirname, '../templates', `${template}.ejs`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const html = ejs.render(templateContent, context);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
