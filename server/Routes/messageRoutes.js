const router = require("express").Router();
const {
  createMessage,
  getMessages,
} = require("../Controllers/messageController");

// Send message
router.post("/", createMessage);

// Get messages of a chat
router.get("/:chatId", getMessages);

module.exports = router;
