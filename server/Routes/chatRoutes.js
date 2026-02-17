const router = require("express").Router();
const {
  createChat,
  getUserChats,
  findChat,
} = require("../Controllers/chatController");

router.post("/", createChat);
router.get("/:userId", getUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
