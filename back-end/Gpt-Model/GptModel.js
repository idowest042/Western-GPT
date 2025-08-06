import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Chat",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messages: [messageSchema] // ✅ Embedded messages directly in Chat
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
