const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin'), controller.list);
router.put('/:id', authenticate, authorize('admin'), controller.update);
router.delete('/:id', authenticate, authorize('admin'), controller.remove);

module.exports = router;
