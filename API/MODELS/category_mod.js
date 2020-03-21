const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'Required'],
        unique: true
    }
});

categorySchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('Category', categorySchema);


