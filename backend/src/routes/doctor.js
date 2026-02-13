const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['admin']), controller.create);
router.get('/', authenticate, authorize(['admin','staff','doctor']), controller.list);
router.get('/:id', authenticate, authorize(['admin','staff','doctor']), controller.get);
router.put('/:id', authenticate, authorize(['admin']), controller.update);
router.delete('/:id', authenticate, authorize(['admin']), controller.remove);

module.exports = router;
