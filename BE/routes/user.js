const express = require('express');
const { signUpHandler, loginHandler } = require('../controllers/userAccount');
const { postCart, deleteCartItem, getUserCart, postOrder, hookPaymentStatus } = require('../controllers/transaction');

const router = express.Router();

router.post('/register', signUpHandler);

router.post('/login', loginHandler);

router.post('/add-to-cart', postCart);

router.delete('/delete-cart-item', deleteCartItem);

router.get('/cart', getUserCart);

router.post('/order', postOrder);

router.post('/update-payment-status', hookPaymentStatus);

module.exports = router;