import { useState, useRef, useEffect } from 'react';
import { useChatStore } from "../AuthStore/useChatStore";
import { Send, Mic, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const { activeChatId, sendMessage, loading } = useChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    
    try {
      await sendMessage(message);
      setMessage('');
      resetTextareaHeight();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Dynamic textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-[#2a2a2a] p-3 sm:p-4 bg-[#1a1a1a]">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Voice Recording Button */}
        <button
          type="button"
          onClick={() => setIsRecording(!isRecording)}
          className={`p-2 rounded-lg flex-shrink-0 ${
            isRecording
              ? 'bg-red-500/20 text-red-500'
              : 'text-[#a0a0a0] hover:text-[#d4af37] hover:bg-[#2a2a2a]'
          } transition-colors duration-200`}
          disabled={loading}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Message Textarea */}
        <div className="flex-1 relative min-w-0"> {/* Added min-w-0 to prevent flex overflow */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeChatId ? "Type your message..." : "Select or create a chat first"}
            className="w-full bg-[#2a2a2a] text-[#f5f5f5] border border-[#333333] rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-200"
            rows={1}
            disabled={loading || !activeChatId}
            aria-label="Message input"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || loading || !activeChatId}
          className={`p-3 rounded-lg flex items-center justify-center flex-shrink-0 ${
            message.trim() && activeChatId && !loading
              ? 'bg-gradient-to-r from-[#d4af37] to-[#f1c232] text-[#0f0f0f] hover:from-[#f1c232] hover:to-[#d4af37]'
              : 'bg-[#2a2a2a] text-[#a0a0a0] cursor-not-allowed'
          } transition-all duration-300 w-11 h-11`} // Fixed square dimensions
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Recording Indicator - Only shows when recording */}
      {isRecording && (
        <div className="mt-2 flex items-center text-red-500 text-sm animate-fade-in">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          <span>Recording... (Press mic to stop)</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;