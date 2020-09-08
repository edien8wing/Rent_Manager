const nodemailer = require("nodemailer");
var MailTool = {};
MailTool.isSend = false;
MailTool.SendNoticeMail = function (errTitle, errMessage) {
  let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    service: "qq", // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
      user: "",
      // 这里密码不是qq密码，是你设置的smtp授权码
      pass: "",
    },
  });

  let mailOptions = {
    from: "", // sender address
    to: "", // list of receivers
    subject: errTitle, // Subject line
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: errMessage, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    MailTool.isSend = true;
    console.log("Message sent: %s", info.messageId);
    // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
  });
};

module.exports = MailTool;
