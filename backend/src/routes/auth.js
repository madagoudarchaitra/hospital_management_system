const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/register', auth.registerValidators, auth.register);
router.post('/login', auth.loginValidators, auth.login);
router.get('/me', require('../middleware/auth').authenticate, auth.me);

module.exports = router;
