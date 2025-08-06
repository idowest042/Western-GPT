import Message from "../Gpt-Model/GptMessageModel.js";
import Chat from "../Gpt-Model/GptModel.js";

export const SendMessage = async (req, res) => {
  try {
    const { message } = req.body;  // Only get message from body
    const { chatId } = req.params; // Get chatId from URL params ← This is the fix!

    console.log("=== DEBUG START ===");
    console.log("Received:", { message, chatId });

    // Validate inputs
    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }
    
    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    // Check if chat exists first
    const existingChat = await Chat.findById(chatId);
    console.log("Chat found:", !!existingChat);

    if (!existingChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Push user's message to chat
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: { role: "user", content: message } }
    });

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: message }],
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return res.status(response.status).json({ message: errText });
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content || "No reply";

    // Push AI reply into chat
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: { role: "assistant", content: aiReply } }
    });

    // Send to frontend
    res.status(200).json({
      reply: aiReply,
      messages: [
        { role: "assistant", content: aiReply }  // Only return AI message since user message is already added optimistically
      ]
    });

  } catch (error) {
    console.error("Error in SendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
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