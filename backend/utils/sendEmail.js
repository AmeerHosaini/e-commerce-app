const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
require("dotenv").config();

const { G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, ADMIN_EMAIL } =
  process.env;

const oauth2client = new OAuth2(
  G_CLIENT_ID,
  G_CLIENT_SECRET,
  G_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

const sendEmailRegister = (to, url, text) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: ADMIN_EMAIL,
    to: to,
    subject: "ACTIVATE YOUR ACCOUNT",
    html: `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
      rel="stylesheet"
    />
    <title>Passioncorners | Account Activation</title>
    <style>
      body {
        background-color: #333333;
        height: 100vh;
        font-family: "Roboto", sans-serif;
        color: #fff;
        position: relative;
        text-align: center;
      }
      .container {
        max-width: 700px;
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
      .wrapper {
        padding: 0 15px;
      }
      .card {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
      span {
        color: #343a40;
      }
      button {
        padding: 1em 6em;
        border-radius: 5px;
        border: 0;
        background-color: #343a40;
        transition: all 0.3s ease-in;
        color:white;
        cursor: pointer;
      }
      button:hover {
        background-color: opacity(0.8);
        transition: all 0.3s ease-in;
      }
      .spacing {
        margin-top: 5rem;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="wrapper">
        <div class="card">
          <h1><span>Welcome !</span> And thank you for registering !</h1>
          <p>Please validate your email by clicking the button below 🙂</p>
          <a href=${url}><button>${text}</button></a>
          <p class="spacing">
            If the button above does not work, please navigate to the link
            provided below 👇🏻
          </p>
          <div>${url}</div>
        </div>
      </div>
    </div>
  </body>
</html>
  `,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

const sendMail = (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = { sendEmailRegister, sendMail };
