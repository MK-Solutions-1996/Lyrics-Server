const express = require("express");
const router = express.Router();
const ArtistController = require("../CONTROLLERS/artist_con");
const CheckApi = require("../MIDDLEWARES/check_api");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/", [CheckApi, upload.single("image")], (req, res, next) => {
  const body = req.body;
  const file = req.file;
  ArtistController.save_artist(body, file)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/", CheckApi, (req, res, next) => {
  ArtistController.find_artist()
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/:id", CheckApi, (req, res, next) => {
  const id = req.params.id;
  ArtistController.find_artist_by_id(id)
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.patch("/:id", [CheckApi, upload.single("image")], (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const file = req.file;
  ArtistController.update_artist(id, body, file)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.delete("/:id", CheckApi, (req, res, next) => {
  const id = req.params.id;
  ArtistController.romove_artist(id)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

module.exports = router;
