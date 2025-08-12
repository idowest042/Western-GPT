import { useState, useEffect } from 'react';
import { Home, MessageSquare, LogOut, Menu, X, Plus } from 'lucide-react';
import { useChatStore } from '../AuthStore/useChatStore';
import { AuthStore } from '../AuthStore/AuthStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Default to closed on mobile
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get state and actions from stores
  const {
    chats,
    activeChatId,
    loading,
    createChat,
    getMessages,
    fetchChats
  } = useChatStore();
  
  const { logout } = AuthStore();

  // Fetch chats when component mounts
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Set default open state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && isOpen && !event.target.closest('.sidebar-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen && window.innerWidth < 1024) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logout(navigate);
  };

  const handleCreateChat = async () => {
    try {
      await createChat("New Chat");
      toast.success("New trail started!");
      // Close sidebar on mobile after creating chat
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to create chat: " + (error.response?.data?.error || error.message));
    }
  };

  const handleChatSelect = (chatId) => {
    getMessages(chatId);
    // Close sidebar on mobile after selecting chat
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] text-[#d4af37] hover:text-[#f1c232] transition-all duration-200"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" />
      )}

      {/* Sidebar Container */}
      <div 
        className={`sidebar-container fixed lg:relative h-screen transition-all duration-300 ease-in-out z-40 ${
          isOpen 
            ? 'translate-x-0 w-72 lg:w-72' 
            : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="h-full bg-[#0f0f0f] text-[#f5f5f5] flex flex-col border-r border-[#2a2a2a] shadow-xl lg:shadow-none">
          
          {/* Header with close button */}
          <div className="p-5 flex items-center justify-between border-b border-[#2a2a2a]">
            <div 
              className={`flex items-center space-x-3 overflow-hidden transition-all ${
                isOpen ? 'w-full opacity-100' : 'w-0 opacity-0 lg:w-full lg:opacity-100'
              }`}
              onMouseEnter={() => setIsHoveringLogo(true)}
              onMouseLeave={() => setIsHoveringLogo(false)}
            >
              <div className={`animate-pulse bg-gradient-to-r from-[#d4af37] to-[#f1c232] p-2 rounded-lg transition-transform duration-300 ${
                isHoveringLogo ? 'rotate-6 scale-105' : ''
              }`}>
                {/* Your logo SVG */}
                <div className="w-6 h-6 bg-[#0f0f0f] rounded"></div>
              </div>
              <h1 className="text-xl font-bold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#f1c232] font-serif tracking-wide">
                WesternGPT
              </h1>
            </div>
            
            {/* Close button - visible on all screens when sidebar is open */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-all duration-200 text-[#d4af37] hover:text-[#f1c232] hover:rotate-90 lg:block"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={handleCreateChat}
            disabled={loading}
            className={`mx-3 my-4 p-3 lg:p-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f1c232] text-[#0f0f0f] font-medium flex items-center justify-center transition-all duration-300 text-sm lg:text-base ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#f1c232] hover:to-[#d4af37] hover:shadow-lg'
            }`}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            <span className={`ml-2 transition-all ${
              isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 w-0 lg:w-0'
            }`}>
              New Chat
            </span>
          </button>
          
          {/* Chat List */}
          <nav className="flex-1 p-3 overflow-y-auto">
            {loading && chats.length === 0 ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#d4af37]"></div>
              </div>
            ) : (
              <ul className="space-y-1">
                {chats.map((chat) => (
                  <li key={chat._id}>
                    <button
                      onClick={() => handleChatSelect(chat._id)}
                      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-[#2a2a2a] group ${
                        activeChatId === chat._id 
                          ? 'bg-gradient-to-r from-[#d4af37]/10 to-[#f1c232]/10 border-l-4 border-[#d4af37] shadow-md' 
                          : ''
                      }`}
                    >
                      <MessageSquare className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                        activeChatId === chat._id 
                          ? 'text-[#d4af37] scale-110' 
                          : 'text-[#f5f5f5] group-hover:text-[#d4af37]'
                      }`} />
                      <span className={`ml-3 text-left transition-all truncate ${
                        isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 w-0 lg:w-0'
                      } ${
                        activeChatId === chat._id ? 'font-medium' : 'group-hover:font-medium'
                      }`}>
                        {chat.title || "New Chat"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>
          
          {/* User Profile and Logout */}
          <div className="mt-auto p-4 border-t border-[#2a2a2a] bg-gradient-to-t from-[#1a1a1a]/80 to-transparent">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full flex items-center p-3 rounded-lg hover:bg-[#2a2a2a]/50 transition-all duration-200 group ${
                isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 text-[#f5f5f5] group-hover:text-[#d4af37] transition-colors duration-200" />
              <span className={`ml-3 transition-all ${
                isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 w-0 lg:w-0'
              }`}>
                {isLoggingOut ? 'Riding into sunset...' : 'Sign Out'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;