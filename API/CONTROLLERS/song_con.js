const mongoose = require("mongoose");
const Song = require("../MODELS/song_mod");
const fs = require("fs");

exports.save_song = (body, file) => {
  return new Promise((resolve, reject) => {
    const saving_function = song => {
      song
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
            reject({ status: 500, error: "Server error" + err });
          }
        });
    };

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
            audioPath: file.path,
            audio: process.env.BASE_URL + "/" + file.originalname,
            audioAvailability: body.audioAvailability,
            audioName: file.originalname
          }
        });
        saving_function(song);
      } else {
        reject({ status: 422, error: { audio: { message: "Required" } } });
      }
    } else {
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
      saving_function(song);
    }
  });
};

exports.find_songs = () => {
  return new Promise((resolve, reject) => {
    Song.find()
      .select(
        "_id sinhalaTitle singlishTitle categories song likes type artist audio "
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
        "_id sinhalaTitle singlishTitle categories song likes type artist audio "
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
const get_audio_path = id => {
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
  return new Promise((resolve, reject) => {
    get_audio_path(id)
      .then(path => {
        const AUDIO_PATH = path;
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
                audioPath: file.path,
                audio: process.env.BASE_URL + "/" + file.originalname,
                audioAvailability: body.audioAvailability,
                audioName: file.originalname
              }
            };
            updatin_function(id, song, AUDIO_PATH);
          } else {
            reject({ status: 422, error: { audio: { message: "Required" } } });
          }
        } else {
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
          updatin_function(id, song, AUDIO_PATH);
        }
      })
      .catch(err => {
        reject({ status: err.status, error: err.error });
      });

    const updatin_function = (id, song, AUDIO_PATH) => {
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
            if (AUDIO_PATH === "default") {
              resolve({ status: 201, message: "success" });
            } else if (AUDIO_PATH === song.audio.audioPath) {
              resolve({ status: 201, message: "success" });
            } else {
              fs.unlinkSync(AUDIO_PATH);
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

exports.remove_song = id => {
  return new Promise((resolve, reject) => {
    get_audio_path(id)
      .then(path => {
        const AUDIO_PATH = path;
        Song.deleteOne({ _id: id })
          .exec()
          .then(result => {
            const delete_count = result.n;
            if (delete_count === 0) {
              reject({ status: 404, error: "No id found" });
            } else {
              if (AUDIO_PATH === "default") {
                resolve({ status: 200, message: "success" });
              } else {
                fs.unlinkSync(AUDIO_PATH);
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
