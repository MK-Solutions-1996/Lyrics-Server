const express = require('express');
const router = express.Router();

const artist_route = require('./ROUTES/artist_route');
const admin_route = require('./ROUTES/admin_route');
const category_route = require('./ROUTES/category_route');
const song_route = require('./ROUTES/song_route');


router.use('/artist', artist_route);
router.use('/admin', admin_route);
router.use('/category', category_route);
router.use('/song', song_route);

module.exports = router;