const express = require('express');
const { postEventHandler, postEventTicketHandler, postImageLogic, updateEvent } = require('../controllers/event');
const adminAuthorization = require('../middleware/adminAuthorization');
const adminLoginHandler = require('../controllers/adminAuthentication');
const multer = require('../middleware/uploadFile');
const { postDestination, postDestinationTicket, postActivity } = require('../controllers/destination');
const { expiredTicketHandler } = require('../controllers/transaction');

const router = express.Router();

router.post('/login', adminLoginHandler);

router.use(adminAuthorization);

router.post('/post-event', multer.array('images', 3), postEventHandler);

router.post('/post-event-ticket/:eventId', postEventTicketHandler);

router.post('/post-destination', multer.array('images', 3), postDestination);

router.post('/post-destination-ticket/:destinationId', postDestinationTicket);

router.post('/post-file',postImageLogic);

router.put('/ticket-status/:userTicketId', expiredTicketHandler);

router.post('/activity', multer.array('images', 3), postActivity);

router.put('/event/:eventId', updateEvent);

module.exports = router;