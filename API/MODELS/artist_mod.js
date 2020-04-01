const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const artist_schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  sinhalaName: {
    type: String,
    required: [true, "Required"],
    unique: true
  },

  singlishName: {
    type: String,
    required: [true, "Required"],
    unique: true
  },

  period: {
    type: String,
    required: [true, "Required"]
  },

  image: {
    imagePath: {
      type: String,
      default: "default"
    },

    image: {
      type: String,
      default: "default"
    },

    imageAvailability: {
      type: Boolean,
      required: [true, "Required"]
    }
  }

  // imageName: {
  //   type: String,
  //   unique: true
  // }
});

artist_schema.plugin(uniqueValidator, { message: "Already exists" });
module.exports = mongoose.model("Artist", artist_schema);
