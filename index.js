const PDFDocument = require('pdfkit');
var aws = require("aws-sdk");
var nodemailer = require("nodemailer");
var ses = new aws.SES();

exports.handler = function (event, context, callback) {
    let pdf = new PDFDocument();

    let buffers = [];
    pdf.on('data', buffers.push.bind(buffers));
    pdf.on('end', () => {
    
        let pdfData = Buffer.concat(buffers);
    
        const mailOptions = {
            from: 'janec2432@gmail.com',
            to: "ethan.yijun@gmail.com",
            attachments: [{
                filename: 'attachment.pdf',
                content: pdfData
            }]
        };
    
        mailOptions.subject = 'PDF in mail';
        mailOptions.text = 'PDF attached';
        var transporter = nodemailer.createTransport({
            SES: ses
        });
        return transporter.sendMail(mailOptions).then(() => {
            console.log('email sent:');
        }).catch(error => {
            console.error('There was an error while sending the email:', error);
        });
    
    });
    const randomNumber = Math.floor(Math.random() * Math.floor(100));
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let year = dateObj.getUTCFullYear();
    const contract = "AS4000";

    const currentDateTime = year + "/" + month;
    pdf.text(`Claim Title: ${event.data.claim_title} Contract Claim No: ${randomNumber} Principle: ${event.data.submitted_by}`, {
        align: 'center'
      }
    );
    pdf.moveDown();
    pdf.text(`Claim month: ${currentDateTime} Claim Amount: ${event.data.amount} Contract: ${contract}`, {
        align: 'center'
      }
    );
    pdf.end();
};