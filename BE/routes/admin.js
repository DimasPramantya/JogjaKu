const express = require('express');
const { postEventHandler, postTicketHandler } = require('../controllers/event');
const adminAuthorization = require('../middleware/adminAuthorization');
const adminLoginHandler = require('../controllers/adminAuthentication');

const router = express.Router();

router.post('/login', adminLoginHandler);

router.use(adminAuthorization);

router.post('/post-event', postEventHandler);

router.post('/post-ticket/:eventId', postTicketHandler);

module.exports = router;