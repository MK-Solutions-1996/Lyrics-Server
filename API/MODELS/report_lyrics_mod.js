const mongoose = require("mongoose");

const reportLyricsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    reportData: {}
});

module.exports = mongoose.model('ReportLyrics', reportLyricsSchema);