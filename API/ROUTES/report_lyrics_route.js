const express = require("express");
const router = express.Router();
const ReportLyricsController = require('../CONTROLLERS/report_lyrics_con');
const CheckAPI = require("../MIDDLEWARES/check_api");


router.post("/", CheckAPI, (req, res, next) => {
    const body = req.body;
    ReportLyricsController.save_report_lyrics(body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});



router.get("/", CheckAPI, (req, res, next) => {
    ReportLyricsController.find_report_lyrics()
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        })
});


router.delete("/:id", CheckAPI, (req, res, next) => {
    const id = req.params.id;
    ReportLyricsController.remove_report_lyrics(id)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
})

module.exports = router;