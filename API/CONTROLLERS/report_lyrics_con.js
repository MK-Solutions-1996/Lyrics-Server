const mongoose = require("mongoose");
const ReportLyrics = require('../MODELS/report_lyrics_mod');


exports.save_report_lyrics = (body) => {
    return new Promise((resolve, reject) => {
        const reportLyrics = new ReportLyrics({
            _id: mongoose.Types.ObjectId(),
            date: body.date,
            reportData: body.reportData
        });
        reportLyrics.date instanceof Date; // '2002-12-09'
        reportLyrics
            .save()
            .then(() => {
                resolve({ status: 201, message: "success" });
            })
            .catch(err => {
                reject({ status: 500, error: "Server error" + err });
            });
    });
}


exports.find_report_lyrics = () => {
    return new Promise((resolve, reject) => {
        ReportLyrics.find()
            .select('_id date reportData')
            .sort('date')
            .exec()
            .then(result => {
                resolve({ status: 200, data: result });
            })
            .catch(() => {
                reject({ status: 500, error: "Server error" });
            });
    })
}


exports.remove_report_lyrics = (id) => {
    return new Promise((resolve, reject) => {
        ReportLyrics.deleteOne({ _id: id })
            .exec()
            .then(() => {
                resolve({ status: 200, message: "success" });
            })
            .catch(() => {
                reject({ status: 500, error: "Server error" });
            })
    })
}