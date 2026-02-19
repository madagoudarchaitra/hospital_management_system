const express = require('express');
const router = express.Router();
const controller = require('../controllers/staffController');
const { authenticate } = require('../middleware/auth');

// Temporarily remove authorization to test
router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, controller.get);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
