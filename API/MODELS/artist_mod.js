const mongoose = require('mongoose');

const artist_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    sinhalaName: {
        type: String,
        required: [true, 'Required']
    },

    singlishName: {
        type: String,
        required: [true, 'Required']
    },

    period: {
        type: String,
        required: [true, 'Required']
    }

});


module.exports = mongoose.model('Artist', artist_schema);