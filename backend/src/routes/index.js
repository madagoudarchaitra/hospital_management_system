const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/patients', require('./patient'));
router.use('/doctors', require('./doctor'));
router.use('/appointments', require('./appointment'));

router.use('/billings', require('./billing'));
router.use('/pharmacies', require('./pharmacy'));
router.use('/lab-reports', require('./labReport'));
router.use('/beds', require('./bed'));
router.use('/staffs', require('./staff'));
router.use('/users', require('./users'));

module.exports = router;
