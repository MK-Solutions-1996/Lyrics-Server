const mongoose = require('mongoose');
const Song = require('../MODELS/song_mod');


exports.save_song = (body) => {
    return new Promise((resolve, reject) => {
        const song = new Song({
            _id: mongoose.Types.ObjectId(),
            sinhalaTitle: body.sinhalaTitle,
            singlishTitle: body.singlishTitle,
            artistId: body.artistId,
            artistName: body.artistName,
            artist: {
                method: 'GET',
                url: process.env.BASE_URL + '/artist/' + body.artistId
            },
            categories: body.categories,
            song: body.song,
            likes: body.likes,
            type: body.type
        });

        song
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

exports.find_songs = () => {
    return new Promise((resolve, reject) => {
        Song
            .find()
            .select('_id sinhalaTitle artistId singlishTitle artist categories song likes type')
            .exec()
            .then(result => {
                resolve({ status: 200, data: result });
            })
            .catch(() => {
                reject({ status: 500, error: 'Server error' });
            });
    });
}


exports.find_song_by_id = (id) => {
    return new Promise((resolve, reject) => {
        Song
            .findById({ _id: id })
            .select('_id sinhalaTitle artistId singlishTitle artist categories song likes type')
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

exports.update_song = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};
        for (const operations of body) {
            update_operation[operations.key] = operations.value;
        }

        Song
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





exports.remove_song = (id) => {
    return new Promise((resolve, reject) => {
        Song
            .deleteOne({ _id: id })
            .exec()
            .then(result => {
                const delete_count = result.n;
                if (delete_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else {
                    resolve({ status: 200, message: 'success' });
                }
            })
            .catch(() => {
                reject({ status: 500, error: 'Server error' });
            });
    });
}

//search songs should be implemented

