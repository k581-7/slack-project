import { useState, useEffect } from "react";
import { useData } from "../../context/DataProvider";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function ChannelMessage({ channel }) {
  const { userHeaders } = useData();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const getChannelMessages = async () => {
    if (!channel?.id) return;
    
    try {
      const requestHeaders = { headers: userHeaders };
      const response = await axios.get(`${API_URL}/channels/${channel.id}/messages`, requestHeaders);
      const { data } = response;
      setMessages(data.data || []);
    } catch (error) {
      console.error("Cannot get channel messages:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !channel?.id) return;

    const tempMessage = {
      id: Date.now(),
      body: message,
      user: { email: 'You' }, // Temporary display
      created_at: new Date().toISOString()
    };

    // Display locally first
    setMessages(prev => [...prev, tempMessage]);
    setMessage("");

    try {
      const requestBody = {
        body: message,
        channel_id: channel.id
      };

      const requestHeaders = { headers: userHeaders };
      const response = await axios.post(`${API_URL}/channels/${channel.id}/messages`, requestBody, requestHeaders);
      const { data } = response;

      if (data.data) {
        // Replace temp message with real one
        setMessages(prev => 
          prev.map(msg => msg.id === tempMessage.id ? data.data : msg)
        );
      }
    } catch (error) {
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert(`❌ Cannot send message: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    getChannelMessages();
  }, [channel?.id]);

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-medium mb-2">Welcome to Channels!</h3>
          <p>Select a channel from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Channel Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <h2 className="text-xl font-semibold"># {channel.name}</h2>
        <p className="text-sm text-gray-600">Channel messages</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm text-gray-900">
                  {msg.user?.email || 'Unknown User'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-gray-800 ml-2">
                {msg.body}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No messages in this channel yet. Be the first to say something!
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${channel.name}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChannelMessage;