const Message = require("../Models/messageModel");
const Chat = require("../Models/chatModel");


// ======================================================
// 1️⃣ SEND MESSAGE
// ======================================================
const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;

    if (!chatId || !senderId || !text) {
      return res.status(400).json({
        success: false,
        error: "chatId, senderId and text are required",
      });
    }

    // Create message
    const newMessage = await Message.create({
      chat: chatId,
      sender: senderId,
      text,
    });

    // Populate sender and chat
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email")
      .populate("chat");

    // Update latestMessage in Chat
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: newMessage._id,
    });

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



// ======================================================
// 2️⃣ GET ALL MESSAGES OF A CHAT
// ======================================================
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


module.exports = {
  createMessage,
  getMessages,
};
