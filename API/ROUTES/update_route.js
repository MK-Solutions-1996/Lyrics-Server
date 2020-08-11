const express = require("express");
const router = express.Router();
const CheckAPI = require("../MIDDLEWARES/check_api");
const UpdateController = require('../CONTROLLERS/update_con');


router.post("/", CheckAPI, (req, res, next) => {
    const body = req.body;
    UpdateController
        .save_update(body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});

router.get("/", CheckAPI, (req, res, next) => {
    UpdateController
        .find_updates()
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});

router.get("/:version", CheckAPI, (req, res, next) => {
    const version = req.params.version;
    UpdateController
        .find_update_by_version(version)
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});

router.patch("/:version", CheckAPI, (req, res, next) => {
    const version = req.params.version;
    const body = req.body;
    UpdateController
        .update_update_by_version(version, body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});

router.delete("/:version", CheckAPI, (req, res, next) => {
    const version = req.params.version;
    UpdateController
        .remove_update_by_version(version)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        })
})

module.exports = router;
