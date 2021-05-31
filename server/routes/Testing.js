const mailgun = require("mailgun-js");
const api_key = "1230a859244d764ee7c8bb01e4f60ea6-fa6e84b7-7c0c9a9c";
const DOMAIN = "sandbox907a5fdc5a724ead837cb8eb6b86ee63.mailgun.org";
const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
const data = {
  from: "Excited User <me@samples.mailgun.org>",
  to: "abdul82303@gmail.com",
  subject: "Hello",
  text: "Testing some Mailgun awesomness!",
};
mg.messages().send(data, function (error, body) {
  if (error) {
    console.log(error);
  }
  console.log(body);
});
