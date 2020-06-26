const mongoose = require("mongoose");

const requestSongScheema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    songName: String,
    date: Date
});

module.exports = mongoose.model('RequestSong', requestSongScheema);