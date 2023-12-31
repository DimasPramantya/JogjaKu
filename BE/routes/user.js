const express = require('express');
const { signUpHandler, loginHandler, getUserData, editUserAccount, changePassword } = require('../controllers/userAccount');
const { 
    postCart, deleteCartItem, getUserCart, postOrder, hookPaymentStatus, 
    getUserCartByDestinationTicketID, 
    getUserOrderHistory
    } = require('../controllers/transaction');
const multer = require('../middleware/uploadFile');
const { getDestinations, getDestinationById, getActivities, getActivityById } = require('../controllers/destination');
const { getEvents, getEventById, getEventsCalendar } = require('../controllers/event');

const router = express.Router();

router.get('/destinations', getDestinations);

router.get('/destination/:destinationId', getDestinationById);

router.get('/events/calendar', getEventsCalendar);

router.get('/events', getEvents);

router.get('/event/:eventId', getEventById);

router.get('/activities', getActivities);

router.get("/activities/:activityId", getActivityById);

router.get('/user', getUserData);

router.post('/register', multer.single('image'), signUpHandler);

router.put('/edit-profile', multer.single('image'), editUserAccount);

router.post('/login', loginHandler);

router.post('/add-to-cart', postCart);

router.delete('/delete-cart-item', deleteCartItem);

router.get('/cart', getUserCart);

router.get('/cart/:destinationTicketId', getUserCartByDestinationTicketID)

router.post('/order', postOrder);

router.post('/update-payment-status', hookPaymentStatus);

router.get('/order-history/',getUserOrderHistory);

router.put('/edit-profile', editUserAccount);

router.put('/password', changePassword);

module.exports = router;