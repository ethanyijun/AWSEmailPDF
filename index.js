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
            to: event.data.superintendent_email,
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
            callback(null, {data: event.data});
        }).catch(error => {
            console.error('There was an error while sending the email:', error);
            callback(null, {err: error, data: event.data});
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
    pdf.image('images/2.png', 0, 15, {width: 300})
   .text('Proportional to width', 0, 0);
    pdf.fontSize(6).text('Date: ', 70, 40)
    pdf.font('Times-Roman').fontSize(25).text('Project A', 250, 50);
    pdf.font('Times-Roman').fontSize(16).text('Engineering Services - Progress Claim 2 Report', 150, 80);
    pdf.fontSize(8).text('Contract Claim No:', 70, 140);
    pdf.fontSize(8).text('Claim Month:', 200, 140);
    pdf.fontSize(8).text('Claim Period:', 310, 140);
    pdf.fontSize(8).text('Contract ', 70, 180);
    pdf.fontSize(8).text('Vendor:', 200, 180);

    pdf.text('URL of the 1.png',{width: 50, height: 50});
    pdf.text('URL of the 2.png',{width: 50, height: 50});
    pdf.end();
};