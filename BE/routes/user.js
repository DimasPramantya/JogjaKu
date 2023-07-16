const express = require('express');
const { signUpHandler } = require('../controller/userAccount');

const router = express.Router();

router.post('/signUp', signUpHandler);

module.exports = router;