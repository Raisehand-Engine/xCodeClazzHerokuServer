const CLIENT_PORT = 3000;
const HtmlTemplateGenerator = require('../classes/HtmlTamplateGenerator');
let mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.NODE_ENV == process.env.PRODUCTION ? process.env.MAILGUN_TLD_LIVE : process.env.MAILGUN_TLD_SANDBOX });

// https://documentation.mailgun.com/en/latest/api-sending.html#examples
class MailGun {

    constructor() {
        this.adminEmail = 'raisehand.io@gmail.com';
        this.backupEmail = 'gouravgupta840@gmail.com';
        this.supportEmail = 'vinodgupta.rh@gmail.com';

        this.isProduction = process.env.NODE_ENV == process.env.PRODUCTION;
        this.host = this.isProduction ? process.env.ROOT_URL : 'http://localhost:' + CLIENT_PORT;
        this.mailGun_Tld = this.isProduction ? process.env.MAILGUN_TLD_LIVE : process.env.MAILGUN_TLD_SANDBOX;
        this.header = { from: `Raisehand Software <raisehand@${this.mailGun_Tld}>` }
        this.defaultSuccessMessage = `An email has been sent successfully.`;
    }

    get adminEmailAddr() { return this.adminEmail; }
    get backupEmailAddr() { return this.backupEmail; }
    get supportEmailAddr() { return this.supportEmail; }

    sendPlainMail(to = [this.adminEmailAddr()], subject = 'Delete This Mail', text = 'If you are reading this boilerplate message on your mail, Please delete this! This message just sent in wrong mail box', callback) {
        const packet = { ...this.header, to: to.join(', '), subject, text };
        this._send(packet, callback);
    }

    sendHtmlMailCc(to = [this.adminEmailAddr()], cc = [this.backupEmailAddr()], subject = 'Delete This Mail', html = HtmlTemplateGenerator.boilerplate(), callback) {
        const packet = {
            ...this.header,
            'o:tracking': 'False',
            to: to.join(', '),
            cc: cc.join(', '),
            subject,
            html,
        };
        this._send(packet, callback);
    }

    sendPlainMailCC(to = [this.adminEmailAddr()], cc = [this.backupEmailAddr()], subject = 'Delete This Mail', text = 'If you are reading this boilerplate message on your mail, Please delete this! This message just sent in wrong mail box', callback) {
        const packet = {
            ...this.header,
            to: to.join(', '),
            cc: cc.join(', '),
            subject,
            text,
        };
        this._send(packet, callback);
    }

    sendPlainMailCC_BCC(to = [this.adminEmailAddr()], cc = [this.backupEmailAddr()], bcc = [this.supportEmailAddr()], subject = 'Delete This Mail', text = 'If you are reading this boilerplate message on your mail, Please delete this! This message just sent in wrong mail box', callback) {
        const packet = {
            ...this.header,
            to: to.join(', '),
            cc: cc.join(', '),
            bcc: bcc.join(', '),
            subject,
            text,
        };
        this._send(packet, callback);
    }

    _send(packet, callback) {
        mailgun.messages().send(packet, (error, _) => {
            if (error) callback(error, null);
            else callback(null, this.defaultSuccessMessage)
        });
    }

}

module.exports = MailGun;