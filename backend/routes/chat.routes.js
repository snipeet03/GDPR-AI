const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createChat, getChats, getChat, sendMessage,
  deleteChat, bookmarkMessage, exportChat
} = require('../controllers/chat.controller');

router.use(protect);
router.post('/', createChat);
router.get('/', getChats);
router.get('/:id', getChat);
router.post('/message', sendMessage);
router.delete('/:id', deleteChat);
router.patch('/:chatId/messages/:messageId/bookmark', bookmarkMessage);
router.get('/:id/export', exportChat);

module.exports = router;
