const nodemailer = require('nodemailer');
const { MAILER_PASS } = require('./keys');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'checkersking8@gmail.com',
    pass: MAILER_PASS // naturally, replace both with your real credentials or an application-specific password
  }
});

const mailOptions = {
  from: 'checkersking8@gmail.com',
  to: 'guptaishan849@gmail.com',
  subject: 'Test Mail',
  html: '<h1>Dudes, we really need your money.</h1>'
};

module.exports = {transporter, mailOptions};