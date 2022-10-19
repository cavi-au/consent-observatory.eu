import nodemailer from 'nodemailer';

class MailService {

    #options;
    #transport;

    /**
     * @param {object} options
     * @param {string} options.host
     * @param {number} options.port
     * @param {string} options.user
     * @param {string} options.pass
     * @param {boolean} options.disabled
     */
    constructor(options) {
        this.#options = options;
    }

    async init(verifyServer = true) {
        this.#transport = nodemailer.createTransport({
            host: this.#options.host,
            port: this.#options.port,
            auth: {
                user: this.#options.user,
                pass: this.#options.pass
            }
        });

        if (verifyServer) {
            await this.#transport.verify();
        }
    }

    async sendMail(mail) {
        let mailObj = {
            from: mail.from,
            to: mail.to,
            subject: mail.subject,
            text: mail.text,
            html: mail.html
        };
        if (!this.#options.disabled) {
            await this.#transport.sendMail(mailObj);
        }
    }

}

export { MailService };