const express = require("express");
const router = express.Router();
const SongController = require("../CONTROLLERS/song_con");
const CheckAPI = require("../MIDDLEWARES/check_api");

router.post("/", (req, res, next) => {
  const body = req.body;
  SongController.save_song(body)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/", (req, res, next) => {
  SongController.find_songs()
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  SongController.find_song_by_id(id)
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  SongController.update_song(id, body)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.delete("/:id", (req, res, next) => {
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
