const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");
const api_key = "1230a859244d764ee7c8bb01e4f60ea6-fa6e84b7-7c0c9a9c";
const DOMAIN = "sandbox907a5fdc5a724ead837cb8eb6b86ee63.mailgun.org";

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// send emails using mail gun
exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );
    // mailgun code

    const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
    const data = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account Activation Link",
      html: `
        <h1>Please use the following link to Activate your account</h1>
        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
        <hr>
        <p> This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
    };
    // mg.message()
    //   .send(data)
    //   .then((sent) => {
    //     return res.json({
    //       message: `Email has sent to ${email} Follow the instruction to activate account`,
    //     });
    //   })
    //   .catch((err) => {
    //     return res.json({
    //       message: err.message,
    //     });
    //   });

    mg.messages().send(data, function (error, body) {
      if (error) {
        return res.json({
          message: error.message,
        });
      }
      return res.json({
        message: `Email has sent to ${email} Follow the instruction to activate account`,
      });
    });
  });
};
// mg.messages().send(data, function (error, body) {
//   if (error) {
//     console.log(error);
//   }
//   console.log(body);
// });

//   const emailData = {
//     form: process.env.EMAIL_FROM,
//     to: email,
//     subject: "Account Activation Link",
//     html: `
//     <h1>Please use the following link to Activate your account</h1>
//     <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
//     <hr>
//     <p> This email may contain sensitive information</p>
//     <p>${process.env.CLIENT_URL}</p>
//     `,
//   };
//   sgMail
//     .send(emailData)
//     .then((sent) => {
//       return res.json({
//         message: `Email has sent to ${email} Follow the instruction to activate account`,
//       });
//     })
//     .catch((err) => {
//       return res.json({
//         message: err.message,
//       });
//     });

// send emails using send grid
// exports.signup = (req, res) => {
//   const { name, email, password } = req.body;
//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is already taken",
//       });
//     }
//     const token = jwt.sign(
//       { name, email, password },
//       process.env.JWT_ACCOUNT_ACTIVATION,
//       {
//         expiresIn: "10m",
//       }
//     );
//     const emailData = {
//       form: process.env.EMAIL_FROM,
//       to: email,
//       subject: "Account Activation Link",
//       html: `
//       <h1>Please use the following link to Activate your account</h1>
//       <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
//       <hr>
//       <p> This email may contain sensitive information</p>
//       <p>${process.env.CLIENT_URL}</p>
//       `,
//     };
//     sgMail
//       .send(emailData)
//       .then((sent) => {
//         return res.json({
//           message: `Email has sent to ${email} Follow the instruction to activate account`,
//         });
//       })
//       .catch((err) => {
//         return res.json({
//           message: err.message,
//         });
//       });
//   });
// };

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log(`JWT VERIFY ACCOUNT ACTIVATION ERROR`, err);
          return res.status(401).json({
            error: `Expired Link. Signup again`,
          });
        }
        const { name, email, password } = jwt.decode(token);
        const user = new User({ name, email, password });
        user.save((err, user) => {
          if (err) {
            console.log(`save user in account activation error`, err);
            return res.status(401).json({
              error: `Error saving user in database, Try signup again`,
            });
          }
          return res.json({
            message: `signup success. Please Signin`,
          });
        });
      }
    );
  } else {
    return res.json({
      message: `something went wrong please try again`,
    });
  }
};

// signin
exports.signin = (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  // const user = findOne({email})
  // if (!user){
  //         return res.status(400).json({
  //         error: `User with that email does not exist. sigup first`,
  //       });
  // }
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: `User with that email does not exist. sigup first`,
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: `Email and password do not match`,
      });
    }
    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

// exports.requireSignin = expressJwt({
//   secret: process.env.JWT_SECRET, //req.user._id
// });

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }
    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.statuus(400).json({
        error: "`User with that email does not exist",
      });
    }
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );
    const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
    const data = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Link",
      html: `
        <h1>Please use the following link to reset your password</h1>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <hr>
        <p> This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
    };
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log(`Reset password link error`, err);
        return res.status(400).json({
          error: `Database connection error on user password forgot request`,
        });
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({
              message: error.message,
            });
          }
          return res.json({
            message: `Email has sent to ${email} Follow the instruction to activate account`,
          });
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: "Expired link. Try again",
          });
        }
        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: `Something went wrong. Try again later`,
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };
          user = _.extend(user, updateFields);
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Error resetting user password",
              });
            }
            res.json({
              message: "Great! Now you can login with your new password",
            });
          });
        });
      }
    );
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            // console.log('')
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("Error Google login on user save", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                {
                  expiresIn: "7d",
                }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed Please Try again",
        });
      }
    });
};

exports.facebookLogin = (req, res) => {
  console.log("Facebook Login Req body", req.body);
  const { userID, accessToken } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  return fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          const { _id, email, name, role } = data;
          return res.json({
            token,
            user: { _id, email, name, role },
          });
        } else {
          let password = email + process.env.JWT_SECRET;
          user = new User({ name, email, password });
          user.save((err, data) => {
            if (err) {
              console.log("Error Facebook login on user save", err);
              return res.status(400).json({
                error: "User signup failed with facebook",
              });
            }
            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = data;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          });
        }
      });
    })
    .catch((error) => {
      res.json({
        error: "Facebook login failed. Try Late",
      });
    });
};
