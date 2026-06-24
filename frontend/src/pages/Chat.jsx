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
      query: { userId: user._id }
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

  if (loading) return <div className="text-center py-20 text-gray-400">Loading chat...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-80px)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-surface border border-gray-800 rounded-t-2xl p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          {otherUser?.avatar ? (
            <img src={otherUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-700" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400 border border-gray-700">
              {otherUser?.name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h2 className="font-bold text-white">{otherUser?.name || 'User'}</h2>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-gray-900 border-x border-gray-800 p-6 overflow-y-auto flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === user._id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-gray-800 text-gray-200 rounded-bl-sm'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-[10px] opacity-60 mt-1 block text-right">
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
      <div className="bg-surface border border-gray-800 rounded-b-2xl p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-primary hover:bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
