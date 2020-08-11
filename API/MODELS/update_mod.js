const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const updateScheema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    currentVersion: {
        type: String,
        unique: true
    },
    updateState: {
        type: Boolean,
        default: false
    },
    newVersion: {
        type: String,
    }
})

updateScheema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('Update', updateScheema);
