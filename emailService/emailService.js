const nodemailer = require("nodemailer");
const ejs = require("ejs");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const attachmentObj = {
  RecipientEmail: [
    {
      filename: "banner.png",
      path: "public/images/banner.png",
      cid: "banner"
    },
    {
      filename: "emoji.png",
      path: "public/images/emoji.png",
      cid: "emoji"
    },
    {
      filename: "sho.png",
      path: "public/images/sho.png",
      cid: "sho"
    },
    {
      filename: "glo.png",
      path: "public/images/glo.png",
      cid: "glo"
    },
    {
      filename: "footer_gifted_logo.png",
      path: "public/images/footer_gifted_logo.png",
      cid: "footer_gifted_logo"
    }
  ],
  ConfirmationEmail: [
    {
      filename: "sho.png",
      path: "public/images/sho.png",
      cid: "sho"
    },
    {
      filename: "glo.png",
      path: "public/images/glo.png",
      cid: "glo"
    },
    {
      filename: "footer_gifted_logo.png",
      path: "public/images/footer_gifted_logo.png",
      cid: "footer_gifted_logo"
    },
    {
      filename: "gift.png",
      path: "public/images/gift.png",
      cid: "gift"
    },
    {
      filename: "banner.png",
      path: "public/images/banner.png",
      cid: "banner"
    }
  ],
  CompleteCheckoutEmail: [
    {
      filename: "gift.png",
      path: "public/images/gift.png",
      cid: "gift"
    },
    {
      filename: "sho.png",
      path: "public/images/sho.png",
      cid: "sho"
    },
    {
      filename: "glo.png",
      path: "public/images/glo.png",
      cid: "glo"
    },
    {
      filename: "footer_gifted_logo.png",
      path: "public/images/footer_gifted_logo.png",
      cid: "footer_gifted_logo"
    }
  ]
};

module.exports = async function sendEmail(options) {
  let html = "";
  if (options.emailType === 1) {
    html = await ejs.renderFile("./emailTemplates/RecipientEmail.ejs", options);
  } else {
    html = await ejs.renderFile(
      "./emailTemplates/CompleteCheckoutEmail.ejs",
      options
    );
  }

  const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey:
        "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"
    })
  );

  // HioOsvbvQ4WytF7j00Tjqg;
  // Set the region
  const recipientEmail =
    options.emailType === 1 ? options.recipientEmail : options.giverEmail;

  console.log(recipientEmail);
  // Create sendEmail params
  const mailOptions = {
    from:
      options.emailType === 1
        ? ` ${options.giverName} <no-reply@givewithgifted.com>`
        : '"Gifted (no-reply)" <no-reply@givewithgifted.com>', // sender address
    replyTo:options.giverEmail,
    to: recipientEmail, // list of receivers
    subject: options.subject
      ? options.subject
      : `${
          options.giverName ? options.giverName : "Gifted"
        } has sent you a gift!`, // Subject line
    html: html, // plain text body
    attachments:
      options.emailType === 1
        ? attachmentObj.RecipientEmail
        : attachmentObj.CompleteCheckoutEmail
  };

  // Create the promise and SES service object
  const email1 = await transporter.sendMail(mailOptions);
  console.log("sendEmail -> email1", email1);
  if (options.emailType === 1) {
    const html2 = await ejs.renderFile(
      "./emailTemplates/ConfirmationEmail.ejs",
      options
    );
    // Create sendEmail params
    const mailOptions2 = {
      from:
        options.emailType === 1
          ? '"Gifted(no-reply)" <no-reply@givewithgifted.com>'
          : ` ${options.giverName} <no-reply@givewithgifted.com>`, // sender address
      to: options.giverEmail, // list of receivers
      subject: "You sent a gift!", // Subject line
      html: html2, // plain text body
      attachments: attachmentObj.ConfirmationEmail
    };

    const email2 = await transporter.sendMail(mailOptions2);
    console.log("sendEmail -> email2", email2);
  }
};
