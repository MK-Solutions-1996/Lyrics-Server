const mongoose = require("mongoose");
const Update = require('../MODELS/update_mod');

exports.save_update = (body) => {
    return new Promise((resolve, reject) => {
        const update = new Update({
            _id: mongoose.Types.ObjectId(),
            currentVersion: body.currentVersion,
            updateState: body.updateState,
            newVersion: body.newVersion
        });
        update
            .save()
            .then(() => {
                resolve({ status: 201, message: 'success' });
            })
            .catch((err) => {
                const validation_errors = err.errors;
                if (validation_errors) {
                    reject({ status: 422, error: 'current Version Already exists' });
                }
                else {
                    reject({ status: 500, error: 'Server Error' });
                }
            });
    });
}

exports.find_updates = () => {
    return new Promise((resolve, reject) => {
        Update
            .find()
            .select("_id currentVersion updateState newVersion")
            .exec()
            .then((result) => {
                resolve({ status: 200, data: result });
            })
            .catch(() => {
                reject({ status: 500, error: 'Server Error' });
            })
    })
}

exports.find_update_by_version = (version) => {
    return new Promise((resolve, reject) => {
        Update
            .find({ currentVersion: version })
            .select("_id currentVersion updateState newVersion")
            .exec()
            .then((result) => {
                resolve({ status: 200, data: result });
            })
            .catch(() => {
                reject({ status: 500, error: 'Server Error' });
            });
    });
}

exports.update_update_by_version = (version, body) => {
    return new Promise((resolve, reject) => {
        Update
            .updateOne(
                { currentVersion: version },
                { updateState: body.updateState },
                { runValidators: true, context: "query" }
            )
            .exec()
            .then(() => {
                resolve({ status: 201, message: 'success' });
            })
            .catch(err => {
                const validation_errors = err.errors;
                if (validation_errors) {
                    reject({ status: 422, error: validation_errors });
                }
                else {
                    reject({ status: 500, error: 'Server Error' });
                }
            })
    });
}

exports.remove_update_by_version = (version) => {
    return new Promise((resolve, reject) => {
        Update
            .deleteOne({ currentVersion: version })
            .exec()
            .then(() => {
                resolve({ status: 201, message: 'success' });
            })
            .catch(() => {
                reject({ status: 500, error: 'Server Error' });
            });
    });
}