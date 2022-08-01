var AWS = require('aws-sdk');
const nodemailer = require("nodemailer")

module.exports = {
    sendTicketsQr: async (toAddress, fromEvent, attachments, first_name, last_name) => {
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
            subject: "Ihre Ballkarten",
            text: `Hallo ${first_name} ${last_name}, <br/> Vielen Dank für Ihre Bestellung. Anbei finden Sie Ihre bestellten Eintrittskarten. Das Ballkommitte freut sich auf Ihr kommen und einen unvergesslichen Abend`,
            attachments: attachments
        });

        return response;
    }
}