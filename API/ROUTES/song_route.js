const express = require("express");
const router = express.Router();
const SongController = require("../CONTROLLERS/song_con");
const CheckAPI = require("../MIDDLEWARES/check_api");
const multer = require("multer");
const MulterAzureStorage = require('multer-azure-storage');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, "./audios/");
//   },
//   filename: function(req, file, cb) {
//     //Rename the file as song's singlish title with file's orginal name
//     const singlishTitle = req.body.singlishTitle;
//     const AUDIO_NAME = singlishTitle + "_" + file.originalname;
//     cb(null, AUDIO_NAME);
//   }
// });

// const upload = multer({ storage: storage });


const con = 'DefaultEndpointsProtocol=https;AccountName=lyricsassetstore;AccountKey=I0y9yB+3LtZO1Lb7wapFNTkYS1hMzGlQSzRiWKkczPqZgeKqjD29IwuDSNUrOFmVY+NtWCgfamCJ/bk0Hae3ZQ==;EndpointSuffix=core.windows.net';

var upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: con,
    containerName: 'audios',
    containerSecurity: 'container'
  })
});


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

router.get("/limit/:number", CheckAPI, (req, res, next) => {
  const limit = parseInt(req.params.number);
  SongController.find_songs_limited(limit)
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


router.patch("/like/:id", CheckAPI, (req, res, next) => {
  const id = req.params.id;
  SongController.update_song_like(id)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    })
});

router.patch("/unlike/:id", CheckAPI, (req, res, next) => {
  const id = req.params.id;
  SongController.update_song_unlike(id)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    })
})

module.exports = router;
