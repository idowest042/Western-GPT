import { Bot } from 'lucide-react';
import { useChatStore } from '../AuthStore/useChatStore';

const HomeChatContainer = () => {
  const { createChat } = useChatStore();

  const handleStartChat = async () => {
    await createChat("New Chat");
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-full text-[#a0a0a0] cursor-pointer"
      onClick={handleStartChat}
    >
      <Bot className="h-12 w-12 mb-4 text-[#d4af37] animate-bounce" />
      <p className="text-lg">Howdy partner! Ask me anything about the Wild West</p>
      <p className="mt-2 text-sm text-[#d4af37] animate-pulse">
        Click anywhere to start chatting
      </p>
    </div>
  );
};

export default HomeChatContainer;