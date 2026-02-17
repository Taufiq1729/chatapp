const Chat = require("../Models/chatModel");

// CREATE CHAT
const createChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;

    if (!firstId || !secondId) {
      return res.status(400).json({ error: "Both user IDs are required" });
    }

    if (firstId === secondId) {
      return res.status(400).json({ error: "Users must be different" });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = new Chat({
      members: [firstId, secondId],
    });

    const savedChat = await newChat.save();

    res.status(201).json(savedChat);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET USER CHATS
const getUserChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const chats = await Chat.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chats);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// FIND CHAT BETWEEN TWO USERS
const findChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.params;

    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChat,
  getUserChats,
  findChat,
};
