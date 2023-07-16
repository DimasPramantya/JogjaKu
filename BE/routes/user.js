const express = require('express');
const { signUpHandler } = require('../controllers/userAccount');

const router = express.Router();

router.post('/signup', signUpHandler);

module.exports = router;