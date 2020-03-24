const mongoose = require('mongoose');
const Artist = require('../MODELS/artist_mod');
const fs = require('fs');


exports.save_artist = (body, file) => {
    return new Promise((resolve, reject) => {
        const artist = new Artist({
            _id: mongoose.Types.ObjectId(),
            sinhalaName: body.sinhalaName,
            singlishName: body.singlishName,
            period: body.period,
            imagePath: file.path,
            image: process.env.BASE_URL + '/' + file.originalname
        });

        artist
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
    });
}


exports.find_artist = () => {
    return new Promise((resolve, reject) => {
        Artist
            .find()
            .select('_id sinhalaName singlishName period image imagePath')
            .exec()
            .then(result => {
                resolve({ status: 200, data: result });
            })
            .catch(() => {
                reject({ status: 500, error: 'Server error' });
            });
    });
}


exports.find_artist_by_id = (id) => {
    return new Promise((resolve, reject) => {
        Artist
            .findById({ _id: id })
            .select('_id sinhalaName singlishName period image imagePath')
            .exec()
            .then(result => {
                if (result) {
                    resolve({ status: 200, data: result });
                }
                else {
                    reject({ status: 404, error: 'No data found' });
                }
            })
            .catch(() => {
                reject({ status: 500, error: 'Server error' });
            });
    });
}

exports.update_artist = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};

        for (const opertaions of body) {
            update_operation[opertaions.key] = opertaions.value;
        }

        Artist
            .updateOne({ _id: id }, { $set: update_operation }, { runValidators: true, context: 'query' })
            .exec()
            .then(result => {
                const updated_count = result.n;
                if (updated_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else {
                    resolve({ status: 201, message: 'success' });
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


const remove_image = (image_path) => {
    return new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(image_path)
            resolve();
        } catch (error) {
            reject(error);
        }

    })

}

exports.romove_artist = (id) => {
    return new Promise((resolve, reject) => {
        Artist
            .findById({ _id: id })
            .exec()
            .then(artist => {
                const image_path = artist.imagePath;
                remove_image(image_path)
                    .then(() => {
                        Artist
                            .deleteOne({ _id: id })
                            .exec()
                            .then(result => {
                                const removed_count = result.n;
                                if (removed_count === 0) {
                                    reject({ status: 404, error: 'No id found' });
                                }
                                else {
                                    resolve({ status: 200, message: 'success' });
                                }
                            })
                            .catch(() => {
                                reject({ status: 500, error: 'Server error' });
                            });
                    })
                    .catch((err) => {
                        reject({ status: 404, error: 'file delete error' + err });
                    })
            })
            .catch(() => {
                reject({ status: 404, error: 'No id found' });
            })
    });
}