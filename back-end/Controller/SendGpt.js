import Message from "../Gpt-Model/GptMessageModel.js";
import Chat from "../Gpt-Model/GptModel.js";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const SendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { chatId } = req.params;

    console.log("=== DEBUG START ===");
    console.log("Received:", { message, chatId });

    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY not configured" });
    }

    const existingChat = await Chat.findById(chatId);
    console.log("Chat found:", !!existingChat);

    if (!existingChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // ✅ Store user message in DB
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: { role: "user", content: message } }
    });

    console.log("Making Groq API request...");

    // ✅ Groq API Call using official SDK
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiReply = chatCompletion.choices[0]?.message?.content || "No response";

    console.log("AI Reply:", aiReply);

    // ✅ Append AI message to DB
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: { role: "assistant", content: aiReply } }
    });

    // ✅ Send response to frontend
    return res.status(200).json({
      reply: aiReply,
      messages: [{ role: "assistant", content: aiReply }]
    });

  } catch (error) {
    console.error("=== ERROR DETAILS ===");
    console.error("Error:", error.message);
    console.error("Full error:", error);
    
    // Better error handling
    if (error.status === 401) {
      return res.status(401).json({ 
        message: "Invalid Groq API key - please check your key at https://console.groq.com/keys",
      });
    }
    if (error.status === 429) {
      return res.status(429).json({ 
        message: "Rate limit exceeded",
      });
    }
    
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const GetMessageById = async (req, res) => {
  try {
    const { chatId } = req.params;
    console.log("Looking for chat:", chatId);
    const chat = await Chat.findById(chatId);
    console.log("Chat found:", chat);
if (!chat) {
  return res.status(404).json({ success: false, error: "Chat not found" });
}
if (chat.userId.toString() !== req.user._id.toString()) {
  return res.status(403).json({ success: false, error: "Unauthorized" });
}


    res.status(200).json({
      success: true,
      messages: chat.messages
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};


export const createChat = async (req, res) => {
  try {
    const newChat = await Chat.create({
      title: req.body.title || "New Chat",
      userId: req.user._id, // Attach current logged-in user
      messages: [], // No messages yet
    });

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      chatId: newChat._id,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create chat",
    });
  }
};

// Add this to your SendGpt.js controller file
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select('_id title createdAt') // Only get these fields
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      chats
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch chats" 
    });
  }
};
export const updateChatTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    
    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update chat" });
  }
};