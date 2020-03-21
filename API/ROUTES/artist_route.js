const express = require('express');
const router = express.Router();
const ArtistController = require('../CONTROLLERS/artist_con');
const CheckApi = require('../MIDDLEWARES/check_api');

router.post('/', CheckApi, (req, res, next) => {
    const body = req.body;
    ArtistController
        .save_artist(body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});

router.get('/', CheckApi, (req, res, next) => {
    ArtistController
        .find_artist()
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});

router.get('/:id', CheckApi, (req, res, next) => {
    const id = req.params.id;
    ArtistController
        .find_artist_by_id(id)
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});

router.patch('/:id', CheckApi, (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    ArtistController
        .update_artist(id, body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});


router.delete('/:id', CheckApi, (req, res, next) => {
    const id = req.params.id;
    ArtistController
        .romove_artist(id)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});



//Search artist should be included.

module.exports = router;