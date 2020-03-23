const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const songSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    sinhalaTitle: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },

    singlishTitle: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },

    artistName: {
        type: String,
        required: [true, 'Required'],
    },

    artistId: {
        type: String,
        required: [true, 'Required'],
    },

    artist: {
        method: {
            type: String,
            required: [true, 'Required'],
        },
        url: {
            type: String,
            required: [true, 'Required'],
        }
    },

    categories: {
        type: Array,
        required: [true, 'Required'],
    },

    song: {
        type: String,
        required: [true, 'Required'],
    },

    likes: {
        type: Number,
        default: 0
    },

    type: {
        type: String,
        required: [true, 'Required'],
    }
});

songSchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('Song', songSchema);