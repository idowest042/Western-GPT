import { useEffect } from 'react';
import { useChatStore } from '../AuthStore/useChatStore';
import HomeChatContainer from './HomeChatContainer';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';

const ChatContainer = () => {
  const { chats, activeChatId, loading, fetchChats, getMessages } = useChatStore();

  useEffect(() => {
    const initializeChat = async () => {
      await fetchChats();
      
      const savedChatId = localStorage.getItem('activeChatId');
      if (savedChatId && chats.some(chat => chat._id === savedChatId)) {
        await getMessages(savedChatId);
      } else if (chats.length > 0) {
        const recentChat = chats[0];
        localStorage.setItem('activeChatId', recentChat._id);
        await getMessages(recentChat._id);
      }
    };

    initializeChat();
  }, [fetchChats]);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-[#f5f5f5]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {activeChatId ? (
          <>
            <MessageList />
            <MessageInput />
          </>
        ) : (
          <HomeChatContainer />
        )}
      </div>
    </div>
  );
};

export default ChatContainer;