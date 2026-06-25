import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, ArrowLeft, Loader } from 'lucide-react';

const Chat = () => {
  const { id: otherUserId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Fetch initial data
    const fetchChatData = async () => {
      try {
        const [msgRes, profileRes] = await Promise.all([
          axios.get(`/api/messages/${otherUserId}`),
          axios.get(`/api/profile/user/${otherUserId}`).catch(() => ({ data: { user: { name: 'Unknown User' } } }))
        ]);

        setMessages(msgRes.data);
        setOtherUser(profileRes.data.user || profileRes.data);
      } catch (error) {
        console.error('Error fetching chat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();

    // Setup Socket.io
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(SOCKET_URL, {
      query: { userId: user._id },
      withCredentials: true
    });

    socketRef.current.on('newMessage', (newMessage) => {
      if (
        (newMessage.sender === otherUserId && newMessage.receiver === user._id) || // Wait, socket logic uses conversation Id in backend, but we receive the raw message
        newMessage.conversationId // Actually, if we just check if it belongs to this conversation
      ) {
        setMessages(prev => [...prev, newMessage]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [otherUserId, user._id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Send via socket
    socketRef.current.emit('sendMessage', {
      senderId: user._id,
      receiverId: otherUserId,
      text: text.trim()
    });

    setText('');
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading chat...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-80px)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border border-slate-200 rounded-t-2xl p-4 flex items-center gap-4 shadow-sm z-10 relative">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          {otherUser?.avatar ? (
            <img src={otherUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
              {otherUser?.name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h2 className="font-bold text-slate-900">{otherUser?.name || 'User'}</h2>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-slate-50 border-x border-slate-200 p-6 overflow-y-auto flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === user._id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-[10px] mt-1 block text-right ${isMe ? 'opacity-80 text-blue-100' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border border-slate-200 rounded-b-2xl p-4 shadow-sm z-10 relative">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-primary hover:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-500 text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
