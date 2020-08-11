const express = require('express');
const router = express.Router();

const artist_route = require('./ROUTES/artist_route');
const admin_route = require('./ROUTES/admin_route');
const category_route = require('./ROUTES/category_route');
const song_route = require('./ROUTES/song_route');
const request_song_route = require('./ROUTES/request_song_route');
const report_lyrics_route = require('./ROUTES/report_lyrics_route');
const update_route = require('./ROUTES/update_route');


router.use('/artist', artist_route);
router.use('/admin', admin_route);
router.use('/category', category_route);
router.use('/song', song_route);
router.use('/requestSong', request_song_route);
router.use('/reportLyrics', report_lyrics_route);
router.use('/update', update_route);

module.exports = router;