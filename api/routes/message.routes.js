const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middlewares/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/:otherUserId', auth, messageController.getMessages);

module.exports = router;