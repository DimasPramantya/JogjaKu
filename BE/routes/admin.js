const express = require('express');
const { postEventHandler } = require('../controllers/event');

const router = express.Router();

router.post('/post-event', postEventHandler);

module.exports = router;