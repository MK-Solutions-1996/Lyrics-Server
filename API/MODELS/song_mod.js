const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const songSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  sinhalaTitle: {
    type: String,
    required: [true, "Required"],
    unique: true
  },

  singlishTitle: {
    type: String,
    required: [true, "Required"],
    unique: true
  },

  categories: {
    type: Array,
    required: [true, "Required"]
  },

  song: {
    type: String,
    required: [true, "Required"]
  },

  likes: {
    type: Number,
    default: 0
  },

  type: {
    type: String,
    required: [true, "Required"]
  },

  artist: {
    type: Array,
    required: [true, "Required"]
  },

  audio: {
    audioPath: {
      type: String,
      default: "default"
    },

    audio: {
      type: String,
      default: "default"
    },

    audioAvailability: {
      type: Boolean,
      required: [true, "Required"]
    }
  }
});

songSchema.plugin(uniqueValidator, { message: "Already exists" });

module.exports = mongoose.model("Song", songSchema);
