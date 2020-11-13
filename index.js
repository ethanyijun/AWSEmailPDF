const PDFDocument = require('pdfkit');
var aws = require("aws-sdk");
var nodemailer = require("nodemailer");
aws.config.update({
    region: "eu-central-1"
});
var ses = new aws.SES({
    apiVersion: '2010-12-01'
});

exports.handler = function (event, context, callback) {
    let pdf = new PDFDocument();

    let buffers = [];
    pdf.on('data', buffers.push.bind(buffers));
    pdf.on('end', () => {
    
        let pdfData = Buffer.concat(buffers);
    
        const mailOptions = {
            from: 'janec2432@gmail.com',
            to: event.superintendent_email,
            attachments: [{
                filename: 'attachment.pdf',
                content: pdfData
            }]
        };
    
        mailOptions.subject = 'Payment Claim Certificate';
        mailOptions.text = 'Hi, please find the payment certificate that has been approved by you in the attachment.';
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


    pdf.image('images/1.png', 50, 45, {width: 100})
    pdf.image('images/2.png', 450, 45, {width: 100})
   .text(`Date ${currentDateTime}`, 60, 120);

    pdf.moveDown()
    pdf.font('Helvetica-Bold').fontSize(25).text(`Claim Title: ${event.claim_title} `,{align: 'center',paragraphGap:'2'});
    
    pdf.font('Times-Italic').fontSize(16).text(`Engineering Services - Progress Claim 2 Report: ${randomNumber} `, {align: 'center'});
    pdf.moveDown();

    pdf.font('Times-Bold').fontSize(12).text(`Contract Claim No: ${randomNumber}`, 80, 250);
    pdf.font('Times-Bold').fontSize(12).text(`Claim Month: ${currentDateTime}`, 350, 250);

    pdf.font('Times-Bold').fontSize(12).text(`Claim Period: - ${currentDateTime}`, 80, 290);
    pdf.font('Times-Bold').fontSize(12).text(`Contract ${contract}`, 350, 290);

    pdf.font('Times-Bold').fontSize(12).text('Vendor:', 80, 330);
    pdf.font('Times-Bold').fontSize(12).text(`Amount: ${event.amount}`, 350, 330);
    pdf.moveDown();

    pdf.font('Times-Bold').fontSize(10).text('Title', 50, 400);
    pdf.font('Times-Bold').fontSize(10).text('Approved Contract Value', 100, 400);

    pdf.font('Times-Bold').fontSize(10).text('%Completed', 230, 400);
    pdf.font('Times-Bold').fontSize(10).text('Previously Claimed', 300, 400);

    pdf.font('Times-Bold').fontSize(10).text('Total Claim', 410, 400);
    pdf.font('Times-Bold').fontSize(10).text('Net Claim', 490, 400);


    pdf.moveTo(65,260).lineTo(500,260).fillAndStroke("#B0E0E6");
    pdf.moveTo(65,300).lineTo(500,300).fillAndStroke("#B0E0E6");
    pdf.moveTo(65,340).lineTo(500,340).fillAndStroke("#B0E0E6");
    pdf.moveTo(45,410).lineTo(550,410).fillAndStroke("#B0E0E6");



    pdf.end();
};