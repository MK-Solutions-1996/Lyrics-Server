const mongoose = require("mongoose");
const Artist = require("../MODELS/artist_mod");
const fs = require("fs");

/* 
    Check the image file is exist, If so save the data to database as well as image file
    will be saved to the 'uploads' folder in API.
*/

exports.save_artist = (body, file) => {
  return new Promise((resolve, reject) => {
    if (body.imageAvailability === "true") {
      if (file) {
        const singlishName = body.singlishName;
        const IMAGE_NAME = singlishName + "_" + file.originalname;
        const IMAGE_PATH = "images\\" + IMAGE_NAME;

        const artist = new Artist({
          _id: mongoose.Types.ObjectId(),
          sinhalaName: body.sinhalaName,
          singlishName: body.singlishName,
          period: body.period,
          image: {
            imagePath: IMAGE_PATH,
            image: process.env.BASE_URL + "/" + IMAGE_NAME,
            imageAvailability: body.imageAvailability
          }
        });
        artist
          .save()
          .then(() => {
            resolve({ status: 201, message: "success" });
          })
          .catch(err => {
            fs.unlinkSync(IMAGE_PATH);
            const validation_errors = err.errors;
            if (validation_errors) {
              reject({ status: 422, error: validation_errors });
            } else {
              reject({ status: 500, error: "Server error" + err });
            }
          });
      } else {
        reject({
          status: 422,
          error: { image: { message: "Required" } }
        });
      }
    } else {
      if (file) {
        const singlishName = body.singlishName;
        const IMAGE_NAME = singlishName + "_" + file.originalname;
        const IMAGE_PATH = "images\\" + IMAGE_NAME;
        fs.unlinkSync(IMAGE_PATH);
      }
      const artist = new Artist({
        _id: mongoose.Types.ObjectId(),
        sinhalaName: body.sinhalaName,
        singlishName: body.singlishName,
        period: body.period,
        image: {
          imageAvailability: body.imageAvailability
        }
      });
      artist
        .save()
        .then(() => {
          resolve({ status: 201, message: "success" });
        })
        .catch(err => {
          const validation_errors = err.errors;
          if (validation_errors) {
            reject({ status: 422, error: validation_errors });
          } else {
            reject({ status: 500, error: "Server error" + err });
          }
        });
    }
  });
};

exports.find_artist = () => {
  return new Promise((resolve, reject) => {
    Artist.find()
      .select("_id sinhalaName singlishName period image imageName")
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
      .select("_id sinhalaName singlishName period image imageName")
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

const get_previous_image_path = id => {
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
    get_previous_image_path(id)
      .then(path => {
        const PREVIOUS_IMAGE_PATH = path;
        if (body.imageAvailability === "true") {
          if (file) {
            const singlishName = body.singlishName;
            const IMAGE_NAME = singlishName + "_" + file.originalname;
            const IMAGE_PATH = "images\\" + IMAGE_NAME;

            const artist = {
              sinhalaName: body.sinhalaName,
              singlishName: body.singlishName,
              period: body.period,
              image: {
                imagePath: IMAGE_PATH,
                image: process.env.BASE_URL + "/" + IMAGE_NAME,
                imageAvailability: body.imageAvailability
              }
            };

            Artist.updateOne(
              { _id: id },
              { $set: artist },
              { runValidators: true, context: "query" }
            )
              .exec()
              .then(result => {
                const updated_count = result.n;
                if (updated_count === 0) {
                  fs.unlinkSync(IMAGE_PATH);
                  reject({ status: 404, error: "No id found" });
                } else {
                  if (PREVIOUS_IMAGE_PATH === "default") {
                    resolve({ status: 201, message: "success" });
                  } else if (IMAGE_PATH === PREVIOUS_IMAGE_PATH) {
                    resolve({ status: 201, message: "success" });
                  } else {
                    fs.unlinkSync(PREVIOUS_IMAGE_PATH);
                    resolve({ status: 201, message: "success" });
                  }
                }
              })
              .catch(err => {
                fs.unlinkSync(IMAGE_PATH);
                const validation_errors = err.errors;
                if (validation_errors) {
                  reject({ status: 422, error: validation_errors });
                } else {
                  reject({ status: 500, error: "Server error" });
                }
              });
          } else {
            const artist = {
              sinhalaName: body.sinhalaName,
              singlishName: body.singlishName,
              period: body.period
            };

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
                  resolve({ status: 201, message: "success" });
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
          }
        } else {
          if (file) {
            const singlishName = body.singlishName;
            const IMAGE_NAME = singlishName + "_" + file.originalname;
            const IMAGE_PATH = "images\\" + IMAGE_NAME;
            fs.unlinkSync(IMAGE_PATH);
          }
          const artist = {
            sinhalaName: body.sinhalaName,
            singlishName: body.singlishName,
            period: body.period,
            image: {
              imageAvailability: body.imageAvailability
            }
          };
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
                resolve({ status: 201, message: "success" });
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
        }
      })
      .catch(err => {
        reject({ status: err.status, error: err.error });
      });
  });
};

exports.romove_artist = id => {
  return new Promise((resolve, reject) => {
    get_previous_image_path(id)
      .then(path => {
        const PREVIOUS_IMAGE_PATH = path;
        Artist.deleteOne({ _id: id })
          .exec()
          .then(result => {
            const removed_count = result.n;
            if (removed_count === 0) {
              reject({ status: 404, error: "No id found" });
            } else {
              if (PREVIOUS_IMAGE_PATH === "default") {
                resolve({ status: 200, message: "success" });
              } else {
                try {
                  fs.unlinkSync(PREVIOUS_IMAGE_PATH);
                  resolve({ status: 200, message: "success" });
                } catch (error) {
                  resolve({ status: 200, message: "success" });
                }
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
