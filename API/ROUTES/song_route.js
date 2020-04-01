const express = require("express");
const router = express.Router();
const SongController = require("../CONTROLLERS/song_con");
const CheckAPI = require("../MIDDLEWARES/check_api");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./audios/");
  },
  filename: function(req, file, cb) {
    //Rename the file as song's singlish title with file's orginal name
    const singlishTitle = req.body.singlishTitle;
    const AUDIO_NAME = singlishTitle + "_" + file.originalname;
    cb(null, AUDIO_NAME);
  }
});

const upload = multer({ storage: storage });

router.post("/", [CheckAPI, upload.single("audio")], (req, res, next) => {
  const body = req.body;
  const file = req.file;
  SongController.save_song(body, file)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/", CheckAPI, (req, res, next) => {
  SongController.find_songs()
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/:id", CheckAPI, (req, res, next) => {
  const id = req.params.id;
  SongController.find_song_by_id(id)
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.patch("/:id", [CheckAPI, upload.single("audio")], (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const file = req.file;
  SongController.update_song(id, body, file)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.delete("/:id", CheckAPI, (req, res, next) => {
  const id = req.params.id;
  SongController.remove_song(id)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

module.exports = router;
