const config = require("config")
const nodeMailer = require("nodemailer")

const mailconfig = config.get("mail")

const transport = nodeMailer.createTransport({
  ...mailconfig,
  auth: {
    user: config.get("mail.username"),
    pass: config.get("mail.password"),
  },
})

module.exports = ({ to, subject, html }) => {
  return transport.sendMail({
    from: config.get("mail.from"),
    to,
    subject,
    html,
  })
}
