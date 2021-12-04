const path = require('path');
const newUser = require('../controlers/signup')

const browser = require('../midleware/ie');


const express = require('express');
const router = express.Router();

router.get('/signup', browser, newUser.User);
router.post('/signup', browser, newUser.dodajUser);

router.get('/login', browser, newUser.loginUser);
router.post('/login', browser, newUser.proveriUser);

router.get('/logout', browser, newUser.logoutUser);



module.exports = router;