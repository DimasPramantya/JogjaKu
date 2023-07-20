const express = require('express');
const { signUpHandler, loginHandler } = require('../controllers/userAccount');

const router = express.Router();

router.post('/register', signUpHandler);

router.post('/login', loginHandler)

module.exports = router;