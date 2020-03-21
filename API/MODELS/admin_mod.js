const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    username: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Required']
    }
});

adminSchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });
module.exports = mongoose.model('Admin', adminSchema);