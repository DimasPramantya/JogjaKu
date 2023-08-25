const express = require('express');
const { signUpHandler, loginHandler, getUserData } = require('../controllers/userAccount');
const { 
    postCart, deleteCartItem, getUserCart, postOrder, hookPaymentStatus, 
    getUserCartByDestinationTicketID, 
    getUserOrderHistory
    } = require('../controllers/transaction');
const multer = require('../middleware/uploadFile');
const { getDestinations, getDestinationById } = require('../controllers/destination');

const router = express.Router();

router.get('/destinations', getDestinations);

router.get('/destination/:destinationId', getDestinationById);

router.get('/user', getUserData);

router.post('/register', multer.single('image'), signUpHandler);

router.post('/login', loginHandler);

router.post('/add-to-cart', postCart);

router.delete('/delete-cart-item', deleteCartItem);

router.get('/cart', getUserCart);

router.get('/cart/:destinationTicketId', getUserCartByDestinationTicketID)

router.post('/order', postOrder);

router.post('/update-payment-status', hookPaymentStatus);

router.get('/order-history/',getUserOrderHistory)

module.exports = router;