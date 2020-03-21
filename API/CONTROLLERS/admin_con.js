const mongoose = require('mongoose');
const Admin = require('../MODELS/admin_mod');
const bcrypt = require('bcryptjs');

exports.save_admin = (body) => {
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
                        resolve({ status: 201, message: 'success' });
                    })
                    .catch(err => {
                        const validation_errors = err.errors;
                        if (validation_errors) {
                            reject({ status: 422, error: validation_errors });
                        }
                        else {
                            reject({ status: 500, error: 'Server error' });
                        }
                    });
            })
            .catch(() => {
                reject({ status: 422, error: 'Password encryption error' });
            });
    });
}


exports.signin_admin = (body) => {
    return new Promise((resolve, reject) => {
        const username = body.username;
        const password = body.password;
        const common_error = 'Invalid username or password';

        Admin.find({ username: username })
            .exec()
            .then(result => {
                if (result.length === 0) {
                    reject({ status: 404, error: common_error });
                }
                else {
                    const admin_password = result[0].password;
                    bcrypt
                        .compare(password, admin_password)
                        .then(result => {
                            if (result) {
                                resolve({ status: 200, message: 'success' });
                            }
                            else {
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
                }
                else {
                    reject({ status: 500, error: 'Server error' });
                }
            });
    });
}


exports.find_admin = () => {
    return new Promise((resolve, reject) => {
        Admin
            .find()
            .select('_id username password')
            .exec()
            .then(result => {
                if (result.length === 0) {
                    reject({ status: 404, error: 'No data found' });
                }
                else {
                    resolve({ status: 200, data: result });
                }
            })
            .catch(() => {
                reject({ status: 500, error: 'Server error' });
            });
    });
}


exports.update_admin_password = (body) => {
    return new Promise((resolve, reject) => {
        const id = body.id;
        const current_password = body.password;
        const new_password = body.newPassword;

        Admin
            .findById({ _id: id })
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
                                        Admin
                                            .updateOne({ _id: id }, { password: hash }, { runValidators: true, context: 'query' })
                                            .exec()
                                            .then(result => {
                                                const updated_count = result.n;
                                                if (updated_count === 0) {
                                                    reject({ status: 404, error: 'No id found' });
                                                }
                                                else {
                                                    resolve({ status: 201, message: 'succees' })
                                                }
                                            })
                                            .catch(err => {
                                                const validation_errors = err.errors;
                                                if (validation_errors) {
                                                    reject({ status: 422, error: validation_errors });
                                                }
                                                else {
                                                    reject({ status: 500, error: 'Server error' });
                                                }
                                            });
                                    })
                                    .catch(() => {
                                        reject({ status: 422, error: 'Password encryption error' });
                                    });
                            }
                            else {
                                reject({ status: 404, error: 'Password not matched' });
                            }
                        })
                        .catch(() => {
                            reject({ status: 500, error: 'Password comparison error' });
                        });
                }
                else {
                    reject({ status: 404, error: 'No id found' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: 'Server error' });
            });

    });
}