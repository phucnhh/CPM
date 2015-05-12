/**
 * EMAIL namespace.
 * @namespace email
 */

var nodemailer = require('nodemailer');


/**
 * Email toolkit
 *
 * @class
 */
function Email() {
    /**
     * Send email
     *
     * @param to
     * @param subject
     * @param bodyPlain
     * @param bodyHTML
     * @param callback
     */
    this.sendEmail = function (from, to, subject, bodyPlain, bodyHTML, attachments, callback) {
        // create reusable transporter object using SMTP transport
        var transporter = nodemailer.createTransport({
            host: 'mail.gandi.net',
            port : 587,
            auth   : {
                user: 'contact@bayrolsolution.com',
                pass: '%BayS0l%'
            }
        });

        var mailOptions = {
            from   : from, // sender address
            to     : to, // list of receivers
            subject: subject, // Subject line
            text   : bodyPlain, // plaintext body
            html   : bodyHTML, // html body
            attachments : attachments
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, callback);
    }
}

module.exports = Email;