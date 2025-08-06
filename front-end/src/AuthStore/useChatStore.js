import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from "react-toastify";

export const useChatStore = create((set, get) => ({
  chats: [],
  messages: [],
  activeChatId: null,
  loading: false,

  // Fetch all chats for user
  fetchChats: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get('/user/chats');
      set({ chats: res.data.chats });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load chats");
    } finally {
      set({ loading: false });
    }
  },

  // Create new chat (with optional initial title)
  createChat: async (title = "New Chat") => {
    try {
      const res = await axiosInstance.post("/user/create", { title });
      set((state) => ({
        chats: [...state.chats, { _id: res.data.chatId, title, messages: [] }],
        activeChatId: res.data.chatId,
        messages: []
      }));
      return res.data.chatId;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create chat");
      throw error;
    }
  },

  // Get messages for a chat
 getMessages: async (chatId) => {
  set({ loading: true });
  try {
    const res = await axiosInstance.get(`/user/messages/${chatId}`);
    localStorage.setItem('activeChatId', chatId); // Save active chat
    set({ 
      messages: res.data.messages || [], // Ensure empty array if no messages
      activeChatId: chatId
    });
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to load messages");
  } finally {
    set({ loading: false });
  }
},

  // Send message with proper title handling
  sendMessage: async (message) => {
    const { activeChatId, messages, chats } = get();
    if (!activeChatId) {
      toast.error("Please select or create a chat first");
      return;
    }

    // Generate temp ID for optimistic update
    const tempId = Date.now().toString();
    const newMessage = { _id: tempId, role: "user", content: message, temp: true };

    // Optimistic update
    set({
      messages: [...messages, newMessage],
      loading: true
    });

    try {
      const res = await axiosInstance.post(`/user/send/${activeChatId}`, { message });

      // Update title if first message
      if (messages.length === 0) {
        const title = message.length > 30 ? `${message.substring(0, 30)}...` : message;
        await axiosInstance.patch(`/user/chats/${activeChatId}`, { title });
        set({
          chats: chats.map(chat => 
            chat._id === activeChatId ? { ...chat, title } : chat
          )
        });
      }

      // Replace temp message with actual response
      set({
        messages: [
          ...messages.filter(m => !m.temp),
          { role: "user", content: message },
          ...res.data.messages
        ],
        loading: false
      });
    } catch (error) {
      // Rollback on error
      set({
        messages: messages.filter(m => m._id !== tempId),
        loading: false
      });
      toast.error(error.response?.data?.error || "Failed to send message");
    }
  }
}));