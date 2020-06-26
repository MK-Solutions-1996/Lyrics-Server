const mongoose = require("mongoose");
const RequestSong = require('../MODELS/request_song_mod');

exports.save_request_song = (body) => {
    return new Promise((resolve, reject) => {
        const requestSong = new RequestSong({
            _id: mongoose.Types.ObjectId(),
            songName: body.songName,
            date: body.date,
        });
        requestSong.date instanceof Date; // '2002-12-09'
        requestSong
            .save()
            .then(() => {
                resolve({ status: 201, message: "success" });
            })
            .catch((err) => {
                reject({ status: 500, error: "Server error" + err });
            })
    })
}


exports.find_request_songs = () => {
    return new Promise((resolve, reject) => {
        RequestSong
            .find()
            .select("_id songName date")
            .sort('date') //sort ascending
            .exec()
            .then(result => {
                resolve({ status: 200, data: result });
            })
            .catch(() => {
                reject({ status: 500, error: "Server error" });
            });
    });
}


exports.remove_request_songs = (id) => {
    return new Promise((resolve, reject) => {
        RequestSong.deleteOne({ _id: id })
            .exec()
            .then(() => {
                resolve({ status: 200, message: "success" });
            })
            .catch(() => {
                reject({ status: 500, error: "Server error" });
            })

    })
}