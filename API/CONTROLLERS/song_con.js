const mongoose = require("mongoose");
const Song = require("../MODELS/song_mod");
const fs = require("fs");
const azureStrorage = require('azure-storage');

const con = 'DefaultEndpointsProtocol=https;AccountName=lyricsassetstore;AccountKey=I0y9yB+3LtZO1Lb7wapFNTkYS1hMzGlQSzRiWKkczPqZgeKqjD29IwuDSNUrOFmVY+NtWCgfamCJ/bk0Hae3ZQ==;EndpointSuffix=core.windows.net';
const blobService = azureStrorage.createBlobService(con);

const deleteImageFile = (blobName) => {
  console.log('blobName:', blobName);
  blobService.deleteBlobIfExists('audios', blobName, (err, result) => {
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



exports.save_song = (body, file) => {

  const BLOB_NAME = file.blobName;
  const URL = file.url;

  return new Promise((resolve, reject) => {
    if (body.audioAvailability === "true") {
      if (file) {

        const song = new Song({
          _id: mongoose.Types.ObjectId(),
          sinhalaTitle: body.sinhalaTitle,
          singlishTitle: body.singlishTitle,
          categories: body.categories,
          song: body.song,
          likes: body.likes,
          type: body.type,
          artist: body.artist,
          audio: {
            audioPath: BLOB_NAME,
            audio: URL,
            audioAvailability: body.audioAvailability
          }
        });
        song
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
          error: { audio: { message: "Required" } }
        });
      }
    } else {
      if (file) {
        deleteImageFile(BLOB_NAME);
      }
      const song = new Song({
        _id: mongoose.Types.ObjectId(),
        sinhalaTitle: body.sinhalaTitle,
        singlishTitle: body.singlishTitle,
        categories: body.categories,
        song: body.song,
        likes: body.likes,
        type: body.type,
        artist: body.artist,
        audio: {
          audioAvailability: body.audioAvailability
        }
      });
      song
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

exports.find_songs = () => {
  return new Promise((resolve, reject) => {
    Song.find()
      .select(
        "_id sinhalaTitle singlishTitle categories song likes type artist audio audioName"
      )
      .exec()
      .then(result => {
        resolve({ status: 200, data: result });
      })
      .catch(() => {
        reject({ status: 500, error: "Server error" });
      });
  });
};

exports.find_song_by_id = id => {
  return new Promise((resolve, reject) => {
    Song.findById({ _id: id })
      .select(
        "_id sinhalaTitle singlishTitle categories song likes type artist audio audioName"
      )
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

/*
 * Returns the path of the audio file which is stored in the DB as 'audioPath'.
 * By using that audio path, the particuler audio file can be deleted from the file structure.
 */
const get_previous_audio_path = id => {
  return new Promise((resolve, reject) => {
    Song.findById({ _id: id })
      .exec()
      .then(song => {
        const audioPath = song.audio.audioPath;
        resolve(audioPath);
      })
      .catch(() => {
        reject({ status: 500, error: "Server Error" });
      });
  });
};

/* 
  * Checks wheather the audio is available or not.
  * If audio available update the all the data as well as the audio file in the file-structure. 
        - If audio is save as previous one, it will keep as previosly in the file structure.
        - If audio file is different one, save the audio file, and then previous audio file will be deleted.
        - If AUDIO_PATH equals to 'default', then non of the file will be deleted. 
*/
exports.update_song = (id, body, file) => {

  const BLOB_NAME = file.blobName;
  const URL = file.url;

  return new Promise((resolve, reject) => {
    get_previous_audio_path(id)
      .then(path => {
        const PREVIOUS_BLOB_NAME = path;
        if (body.audioAvailability === "true") {
          if (file) {

            const song = {
              sinhalaTitle: body.sinhalaTitle,
              singlishTitle: body.singlishTitle,
              categories: body.categories,
              song: body.song,
              likes: body.likes,
              type: body.type,
              artist: body.artist,
              audio: {
                audioPath: BLOB_NAME,
                audio: URL,
                audioAvailability: body.audioAvailability
              }
            };
            Song.updateOne(
              { _id: id },
              { $set: song },
              { runValidators: true, context: "query" }
            )
              .exec()
              .then(result => {
                const updated_count = result.n;
                if (updated_count === 0) {
                  reject({ status: 404, error: "No id found" });
                } else {
                  if (PREVIOUS_BLOB_NAME === "default") {
                    resolve({ status: 201, message: "success" });
                  } else if (PREVIOUS_BLOB_NAME === BLOB_NAME) {
                    resolve({ status: 201, message: "success" });
                  } else {
                    deleteImageFile(BLOB_NAME);
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
            const song = {
              sinhalaTitle: body.sinhalaTitle,
              singlishTitle: body.singlishTitle,
              categories: body.categories,
              song: body.song,
              likes: body.likes,
              type: body.type,
              artist: body.artist
            };

            Song.updateOne(
              { _id: id },
              { $set: song },
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

          const song = {
            sinhalaTitle: body.sinhalaTitle,
            singlishTitle: body.singlishTitle,
            categories: body.categories,
            song: body.song,
            likes: body.likes,
            type: body.type,
            artist: body.artist,
            audio: {
              audioAvailability: body.audioAvailability
            }
          };
          Song.updateOne(
            { _id: id },
            { $set: song },
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

exports.remove_song = id => {
  return new Promise((resolve, reject) => {
    get_previous_audio_path(id)
      .then(path => {
        const PREVIOUS_BLOB_NAME = path;
        console.log("PREVIOUS_BLOB_NAME:", PREVIOUS_BLOB_NAME);
        Song.deleteOne({ _id: id })
          .exec()
          .then(result => {
            const delete_count = result.n;
            if (delete_count === 0) {
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
