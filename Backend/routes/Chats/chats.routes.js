const router = require('express').Router();
const chatOperations = require('../../controllers/Chats/chats.controller');

router.post('/newconversation', chatOperations.newConversation);
router.post('/newmessage', chatOperations.sendMessage);
router.get('/messages/:id', chatOperations.getMessages);
router.get('/conversation/:id', chatOperations.getConversations);

module.exports = router;