const express = require('express');
const router = express.Router();
const AdminController = require('../CONTROLLERS/admin_con');
const CheckAPI = require('../MIDDLEWARES/check_api');

router.post('/', CheckAPI, (req, res, next) => {
    const body = req.body;
    AdminController
        .save_admin(body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});


router.post('/signin', CheckAPI, (req, res, next) => {
    const body = req.body;
    AdminController
        .signin_admin(body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });

})

router.get('/', CheckAPI, (req, res, next) => {
    AdminController
        .find_admin()
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});


router.patch('/', CheckAPI, (req, res, next) => {
    const body = req.body;
    AdminController
        .update_admin_password(body)
        .then(result => {
            res.status(result.status).json(result.message);
        })
        .catch(err => {
            res.status(err.status).json(err.error);
        });
});



module.exports = router;