const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: [String], // storing userIds as strings
      required: true,
      validate: [arrayLimit, "Chat must have exactly 2 members"],
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length === 2;
}

module.exports = mongoose.model("Chat", chatSchema);
