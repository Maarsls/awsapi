var AWS = require('aws-sdk');
const nodemailer = require("nodemailer")

module.exports = {
    sendTicketsQr: async (toAddress, fromEvent, attachments) => {
        const mailer = nodemailer.createTransport({
            SES: new AWS.SES({
                accessKeyId: process.env.AWS_SES_ACCESSKEYID,
                secretAccessKey: process.env.AWS_SES_ACCESSKEY,
                region: 'eu-central-1',
            }),
        });
        const response = await mailer.sendMail({
            from: '"Deine Ballkarten - ' + fromEvent + '" <shop@tyvent.at>',
            to: toAddress,
            subject: "Ihrwe Ballkarten",
            text: `Anbei finden Sie Ihre Karten`,
            attachments: attachments
        });

        return response;
    }
}