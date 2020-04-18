const mongoose = require("mongoose");
const Artist = require("../MODELS/artist_mod");
const fs = require("fs");
const azureStrorage = require('azure-storage');

const con = 'DefaultEndpointsProtocol=https;AccountName=lyricsassetstore;AccountKey=I0y9yB+3LtZO1Lb7wapFNTkYS1hMzGlQSzRiWKkczPqZgeKqjD29IwuDSNUrOFmVY+NtWCgfamCJ/bk0Hae3ZQ==;EndpointSuffix=core.windows.net';
const blobService = azureStrorage.createBlobService(con);

const deleteImageFile = (blobName) => {
  console.log('blobName:', blobName);
  blobService.deleteBlobIfExists('images', blobName, (err, result) => {
    if (err) {
      console.log('err:', err);
    }
    if (result) {
      console.log('deleted');
    }
    else {
      console.log('not deleted');
    }
  });
}



/* 
    Check the image file is exist, If so save the data to database as well as image file
    will be saved to the 'uploads' folder in API.
*/

exports.save_artist = (body, file) => {

  const BLOB_NAME = file.blobName;
  const URL = file.url;

  return new Promise((resolve, reject) => {
    if (body.imageAvailability === "true") {
      if (file) {
        const artist = new Artist({
          _id: mongoose.Types.ObjectId(),
          sinhalaName: body.sinhalaName,
          singlishName: body.singlishName,
          period: body.period,
          image: {
            imagePath: BLOB_NAME,
            image: URL,
            imageAvailability: body.imageAvailability
          }
        });
        artist
          .save()
          .then(() => {
            resolve({ status: 201, message: "success" });
          })
          .catch(err => {
            deleteImageFile(BLOB_NAME);
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
        deleteImageFile(BLOB_NAME);
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

  const BLOB_NAME = file.blobName;
  const URL = file.url;

  return new Promise((resolve, reject) => {
    get_previous_image_path(id)
      .then(path => {
        const PREVIOUS_BLOB_NAME = path; // path means previous image's blobName
        if (body.imageAvailability === "true") {
          if (file) {
            const artist = {
              sinhalaName: body.sinhalaName,
              singlishName: body.singlishName,
              period: body.period,
              image: {
                imagePath: BLOB_NAME,
                image: URL,
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
                  deleteImageFile(BLOB_NAME);
                  reject({ status: 404, error: "No id found" });
                } else {
                  if (PREVIOUS_BLOB_NAME === "default") {
                    resolve({ status: 201, message: "success" });
                  } else if (BLOB_NAME === PREVIOUS_BLOB_NAME) {
                    resolve({ status: 201, message: "success" });
                  } else {
                    deleteImageFile(PREVIOUS_BLOB_NAME);
                    resolve({ status: 201, message: "success" });
                  }
                }
              })
              .catch(err => {
                deleteImageFile(BLOB_NAME);
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
            deleteImageFile(BLOB_NAME);
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
        const PREVIOUS_BLOB_NAME = path;
        Artist.deleteOne({ _id: id })
          .exec()
          .then(result => {
            const removed_count = result.n;
            if (removed_count === 0) {
              reject({ status: 404, error: "No id found" });
            } else {
              if (PREVIOUS_BLOB_NAME === "default") {
                resolve({ status: 200, message: "success" });
              } else {
                try {
                  deleteImageFile(PREVIOUS_BLOB_NAME);
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
