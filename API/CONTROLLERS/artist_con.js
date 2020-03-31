const mongoose = require("mongoose");
const Artist = require("../MODELS/artist_mod");
const fs = require("fs");

/* 
    Check the image file is exist, If so save the data to database as well as image file
    will be saved to the 'uploads' folder in API.
*/

exports.save_artist = (body, file) => {
  return new Promise((resolve, reject) => {
    const saving_function = artist => {
      artist
        .save()
        .then(() => {
          resolve({ status: 201, message: "success" });
        })
        .catch(err => {
          //fs.unlinkSync(file.path);
          const validation_errors = err.errors;
          if (validation_errors) {
            reject({ status: 422, error: validation_errors });
          } else {
            reject({ status: 500, error: "Server error" });
          }
        });
    };

    if (body.imageAvailability === "true") {
      if (file) {
        const artist = new Artist({
          _id: mongoose.Types.ObjectId(),
          sinhalaName: body.sinhalaName,
          singlishName: body.singlishName,
          period: body.period,
          image: {
            imagePath: file.path,
            image: process.env.BASE_URL + "/" + file.originalname,
            imageName: file.originalname,
            imageAvailability: body.imageAvailability
          }
        });
        saving_function(artist);
      } else {
        reject({
          status: 422,
          error: { image: { imageName: { message: "Required" } } }
        });
      }
    } else {
      const artist = new Artist({
        _id: mongoose.Types.ObjectId(),
        sinhalaName: body.sinhalaName,
        singlishName: body.singlishName,
        period: body.period,
        image: {
          imageAvailability: body.imageAvailability
        }
      });
      saving_function(artist);
    }
  });
};

exports.find_artist = () => {
  return new Promise((resolve, reject) => {
    Artist.find()
      .select("_id sinhalaName singlishName period image ")
      .exec()
      .then(result => {
        resolve({ status: 200, data: result });
      })
      .catch(() => {
        reject({ status: 500, error: "Server error" });
      });
  });
};

exports.find_artist_by_id = id => {
  return new Promise((resolve, reject) => {
    Artist.findById({ _id: id })
      .select("_id sinhalaName singlishName period image ")
      .exec()
      .then(result => {
        if (result) {
          resolve({ status: 200, data: result });
        } else {
          reject({ status: 404, error: "No data found" });
        }
      })
      .catch(() => {
        reject({ status: 500, error: "Server error" });
      });
  });
};

const get_image_path = id => {
  return new Promise((resolve, reject) => {
    Artist.findById({ _id: id })
      .exec()
      .then(artist => {
        const imagePath = artist.image.imagePath;
        resolve(imagePath);
      })
      .catch(() => {
        reject({ status: 500, error: "Server Error" });
      });
  });
};

/* 
    If the image file is exists in request, update the image file as well, 
    if the image image file is not in request other data will be updated.
*/
exports.update_artist = (id, body, file) => {
  return new Promise((resolve, reject) => {
    get_image_path(id)
      .then(path => {
        const IMAGE_PATH = path;
        if (body.imageAvailability === "true") {
          if (file) {
            const artist = {
              sinhalaName: body.sinhalaName,
              singlishName: body.singlishName,
              period: body.period,
              image: {
                imagePath: file.path,
                image: process.env.BASE_URL + "/" + file.originalname,
                imageName: file.originalname,
                imageAvailability: body.imageAvailability
              }
            };
            updating_function(id, artist, IMAGE_PATH);
          } else {
            reject({
              status: 422,
              error: { image: { imageName: { message: "Required" } } }
            });
          }
        } else {
          const artist = {
            sinhalaName: body.sinhalaName,
            singlishName: body.singlishName,
            period: body.period,
            image: {
              imageAvailability: body.imageAvailability
            }
          };
          updating_function(id, artist, IMAGE_PATH);
        }
      })
      .catch(err => {
        reject({ status: err.status, error: err.error });
      });

    const updating_function = (id, artist, IMAGE_PATH) => {
      Artist.updateOne(
        { _id: id },
        { $set: artist },
        { runValidators: true, context: "query" }
      )
        .exec()
        .then(result => {
          const updated_count = result.n;
          if (updated_count === 0) {
            reject({ status: 404, error: "No id found" });
          } else {
            if (IMAGE_PATH === "default") {
              resolve({ status: 201, message: "success" });
            } else if (IMAGE_PATH === artist.image.imagePath) {
              resolve({ status: 201, message: "success" });
            } else {
              fs.unlinkSync(IMAGE_PATH);
              resolve({ status: 201, message: "success" });
            }
          }
        })
        .catch(err => {
          const validation_errors = err.errors;
          if (validation_errors) {
            reject({ status: 422, error: validation_errors });
          } else {
            reject({ status: 500, error: "Server error" });
          }
        });
    };
  });
};

exports.romove_artist = id => {
  return new Promise((resolve, reject) => {
    get_image_path(id)
      .then(path => {
        const IMAGE_PATH = path;
        Artist.deleteOne({ _id: id })
          .exec()
          .then(result => {
            const removed_count = result.n;
            if (removed_count === 0) {
              reject({ status: 404, error: "No id found" });
            } else {
              if (IMAGE_PATH === "default") {
                resolve({ status: 200, message: "success" });
              } else {
                fs.unlinkSync(IMAGE_PATH);
                resolve({ status: 200, message: "success" });
              }
            }
          })
          .catch(() => {
            reject({ status: 500, error: "Server error" });
          });
      })
      .catch(err => {
        reject({ status: err.status, error: err.error });
      });
  });
};
