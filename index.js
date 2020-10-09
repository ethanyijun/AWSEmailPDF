const PDFDocument = require('pdfkit');
var aws = require("aws-sdk");
var nodemailer = require("nodemailer");

var ses = new aws.SES();
var s3 = new aws.S3();
var pdfBuffer;
async function loadPDF() {
    pdfBuffer = await new Promise(resolve => {
        const doc = new PDFDocument()
      
        doc.text('hello world', 100, 50)
        doc.end()
      
        //Finalize document and convert to buffer array
        let buffers = []
        doc.on("data", buffers.push.bind(buffers))
        doc.on("end", () => {
          let pdfData = new Uint8Array(Buffer.concat(buffers))
          resolve(pdfData)
        })
      })
}
loadPDF();
exports.handler = function (event, context, callback) {

    var mailOptions = {
        from: "janec2432@gmail.com",
        subject: "This is an email sent from a Lambda function!",
        html: `<p>You got a contact message, key info: <b>${JSON.stringify(event)}</b></p>`,
        to: "ethan.yijun@gmail.com",
        attachments: [
            {
                filename: "Attachment.pdf",
                content: pdfBuffer
            }
        ]
        // bcc: Any BCC address you want here in an array,
    };

    // create Nodemailer SES transporter
    var transporter = nodemailer.createTransport({
        SES: ses
    });

    // send email
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error sending email");
            callback(err);
        } else {
            console.log("Email sent successfully");
            callback();
        }
    });
};