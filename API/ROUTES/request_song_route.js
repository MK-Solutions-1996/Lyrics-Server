const express = require("express");
const router = express.Router();
const RequestSongController = require('../CONTROLLERS/request_song_con');
const CheckAPI = require("../MIDDLEWARES/check_api");


router.post("/", CheckAPI, (req, res, next) => {
    const body = req.body;
    RequestSongController.save_request_song(body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});

router.get("/", CheckAPI, (req, res, next) => {
    RequestSongController.find_request_songs()
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        })
})

router.delete("/:id", CheckAPI, (req, res, next) => {
    const id = req.params.id;
    RequestSongController.remove_request_songs(id)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
})

module.exports = router;