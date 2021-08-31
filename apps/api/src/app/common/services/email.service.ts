import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    transporter = nodemailer.createTransport({
        service: 'gmail',
        host: this.config.get('MAIL_HOST'),
        port: this.config.get('MAIL_PORT'),
        secure: this.config.get('MAIL_SECURE'),
        auth: {
            user: this.config.get('MAIL_USER'),
            pass: this.config.get('MAIL_PASS'),
        }
    });

    constructor(
        private config: ConfigService
    ) { }

    async sendMail(email: string, mailOptions: any) {
        mailOptions.subject = this.config.get<string>("APP_NAME") + ' - ' + mailOptions.subject
        mailOptions.text = this.config.get<string>("APP_NAME") + ' - ' + mailOptions.text
        // eslint-disable-next-line no-async-promise-executor
        const sent = await new Promise<boolean>(async (resolve, reject) => {
            return await this.transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log('Message sent: %s', error);
                    return reject(false);
                }
                console.log('Message sent: %s', info.messageId);
                resolve(true);
            });
        })

        return sent;
    }

    async verify() {
        return this.transporter.verify();
    }
}