const mongoose = require("mongoose");
const Admin = require("../MODELS/admin_mod");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

exports.save_admin = body => {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(body.password, 10)
      .then(hash => {
        const admin = new Admin({
          _id: mongoose.Types.ObjectId(),
          username: body.username,
          password: hash
        });
        admin
          .save()
          .then(() => {
            resolve({ status: 201, message: "success" });
          })
          .catch(err => {
            const validation_errors = err.errors;
            if (validation_errors) {
              reject({ status: 422, error: validation_errors });
            } else {
              reject({ status: 500, error: "Server error" });
            }
          });
      })
      .catch(() => {
        reject({ status: 422, error: "Password encryption error" });
      });
  });
};

exports.signin_admin = body => {
  return new Promise((resolve, reject) => {
    const username = body.username;
    const password = body.password;
    const common_error = "Invalid username or password";

    Admin.find({ username: username })
      .exec()
      .then(adminData => {
        if (adminData.length === 0) {
          reject({ status: 404, error: common_error });
        } else {
          const admin_password = adminData[0].password;
          bcrypt
            .compare(password, admin_password)
            .then(result => {
              if (result) {
                resolve({ status: 200, data: adminData[0] });
              } else {
                reject({ status: 404, error: common_error });
              }
            })
            .catch(err => {
              reject({ status: 500, error: err });
            });
        }
      })
      .catch(err => {
        const validation_errors = err.errors;
        if (validation_errors) {
          reject({ status: 422, error: validation_errors });
        } else {
          reject({ status: 500, error: "Server error" });
        }
      });
  });
};

exports.find_admin = () => {
  return new Promise((resolve, reject) => {
    Admin.find()
      .select("_id username password")
      .exec()
      .then(result => {
        if (result.length === 0) {
          reject({ status: 404, error: "No data found" });
        } else {
          resolve({ status: 200, data: result });
        }
      })
      .catch(() => {
        reject({ status: 500, error: "Server error" });
      });
  });
};

exports.update_admin_password = body => {
  return new Promise((resolve, reject) => {
    const id = body.id;
    const current_password = body.password;
    const new_password = body.newPassword;

    Admin.findById({ _id: id })
      .exec()
      .then(adminData => {
        if (adminData) {
          const admin_password = adminData.password; // hash
          bcrypt
            .compare(current_password, admin_password)
            .then(result => {
              if (result) {
                bcrypt
                  .hash(new_password, 10)
                  .then(hash => {
                    Admin.updateOne(
                      { _id: id },
                      { password: hash },
                      { runValidators: true, context: "query" }
                    )
                      .exec()
                      .then(result => {
                        const updated_count = result.n;
                        if (updated_count === 0) {
                          reject({ status: 404, error: "No id found" });
                        } else {
                          resolve({ status: 201, message: "succees" });
                        }
                      })
                      .catch(err => {
                        const validation_errors = err.errors;
                        if (validation_errors) {
                          reject({ status: 422, error: validation_errors });
                        } else {
                          reject({ status: 500, error: "Server error" });
                        }
                      });
                  })
                  .catch(() => {
                    reject({ status: 422, error: "Password encryption error" });
                  });
              } else {
                reject({ status: 404, error: "Password not matched" });
              }
            })
            .catch(() => {
              reject({ status: 500, error: "Password comparison error" });
            });
        } else {
          reject({ status: 404, error: "No id found" });
        }
      })
      .catch(err => {
        reject({ status: 500, error: "Server error" });
      });
  });
};

var CODE = "";

exports.send_verification_code = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  CODE = random.toString();

  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SYSTEM_EMAIL,
        pass: process.env.SYSTEM_PASS
      }
    });

    let mailOptions = {
      from: process.env.SYSTEM_EMAIL,
      to: "codebrightsoftware@gmail.com",
      subject: "Lyrics Application verification code",
      text: CODE
    };

    console.log("mailOptions", mailOptions);

    transporter
      .sendMail(mailOptions)
      .then(() => {
        resolve({ status: 200, message: "Email is sent" });
      })
      .catch(err => {
        reject({ status: 500, error: "Email not sent" + err });
      });
  });
};

exports.forgot_password = body => {
  return new Promise((resolve, reject) => {
    const verification_code = body.verificationCode;
    const new_password = body.newPassword;
    const confirm_password = body.confirmPassword;

    console.log("CODE:", CODE);

    if (verification_code === CODE) {
      if (new_password === confirm_password) {
        const username = "admin";
        Admin.find({ username: username })
          .exec()
          .then(admin => {
            const id = admin[0]._id;
            bcrypt
              .hash(new_password, 10)
              .then(hash => {
                Admin.updateOne({ _id: id }, { $set: { password: hash } })
                  .exec()
                  .then(result => {
                    const updated_count = result.n;
                    if (updated_count === 0) {
                      reject({ status: 404, error: "Password not changed" });
                    } else {
                      CODE = "";
                      resolve({
                        status: 201,
                        message: "Password changed successfully"
                      });
                    }
                  })
                  .catch(() => {
                    reject({ status: 500, error: "Server error" });
                  });
              })
              .catch(() => {
                reject({ status: 422, error: "Password encryption error" });
              });
          })
          .catch(() => {
            reject({ status: 500, error: "Server error" });
          });
      } else {
        reject({ status: 422, error: "Password not matched" });
      }
    } else {
      reject({ status: 422, error: "Invalid verification code" });
    }
  });
};
