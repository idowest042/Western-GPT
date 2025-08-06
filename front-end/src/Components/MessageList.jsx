import { useEffect, useRef } from 'react';
import { useChatStore } from "../AuthStore/useChatStore"
import { Bot, User } from 'lucide-react';

const MessageList = () => {
  const { messages, loading } = useChatStore();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d4af37]"></div>
        </div>
      )}

      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full text-[#a0a0a0]">
          <Bot className="h-12 w-12 mb-4 text-[#d4af37]" />
          <p>Howdy partner! Ask me anything about the Wild West</p>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-3xl rounded-lg p-4 ${message.role === 'user' 
              ? 'bg-gradient-to-r from-[#d4af37]/20 to-[#f1c232]/20 border border-[#d4af37]/30'
              : 'bg-[#1a1a1a] border border-[#2a2a2a]'}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'text-[#f1c232]' : 'text-[#d4af37]'}`}>
                {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'WesternGPT'}
                </div>
                <div className="text-[#f5f5f5] whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;