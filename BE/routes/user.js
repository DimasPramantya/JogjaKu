const express = require('express');
const { signUpHandler, loginHandler } = require('../controllers/userAccount');
const { postCart, deleteCartItem, getUserCart } = require('../controllers/transaction');

const router = express.Router();

router.post('/register', signUpHandler);

router.post('/login', loginHandler);

router.post('/add-to-cart', postCart);

router.delete('/delete-cart-item', deleteCartItem);

router.get('/cart', getUserCart);

module.exports = router;