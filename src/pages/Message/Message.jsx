import { useState, useEffect } from "react";
import { useData } from "../../context/DataProvider";
import axios from "axios";
import "./Message.css";

const API_URL = import.meta.env.VITE_API_URL;

function Message({ receiverId = null, receiverType = "User", channelId = null, showReceiverInput = false, messages, setMessages, receiverEmail = null }) {
  const { userHeaders, user } = useData();
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('UserHeaders:', userHeaders);

    // Determine the actual receiver based on props
    const actualReceiverId = receiverId || Number(receiver);
    const actualReceiverType = channelId ? "Channel" : receiverType;
    const actualReceiverIdForAPI = channelId || actualReceiverId;

    const newMessage = {
      id: Date.now(),
      receiver_id: actualReceiverIdForAPI,
      receiver_type: actualReceiverType,
      body: message,
      sender: { uid: user?.id },
    };
      

    // Display locally first
    console.log("📝 New local message:", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    console.log('Message: ', message);
    setMessage("");
    console.log('Message: ', message);
    try {
      const requestBody = {
        receiver_id: actualReceiverIdForAPI,
        receiver_class: actualReceiverType,
        body: message,
      };
      console.log('RequestBody: ', requestBody);
      const requestHeaders = {
        headers: userHeaders,
      };

      const response = await axios.post(`${API_URL}/messages`, requestBody, requestHeaders);
      const { data } = response;

      if (data.data) {
        console.log("RESPONSE:", data);
        alert("✅ Successfully sent a message!");
        fetchMessages(); 
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      alert(`${error}❌ Cannot send message`);
    }
  };

const fetchMessages = async () => {
  try {
    console.log('ReceiverID: ', receiverId);
    const response = await axios.get(`${API_URL}/messages`, {
      params: {
        receiver_id: channelId || receiverId,
        receiver_class: channelId ? "Channel" : "User",
      },
      headers: userHeaders,
    });
    console.log('Response: ', response.data);
    setMessages(response.data.data || []);
    console.log(messages);
  } catch (error) {
    console.error("❌ Failed to fetch messages:", error);
  }
};
  
useEffect(() => {
  if (receiverId) {
    fetchMessages();
  }
}, [receiverId]);


  // Helper function to display receiver info
  const getReceiverDisplay = (msg) => {
    if (channelId) {
      return `Channel #${channelId}`;
    }
    if (receiverId) {
      return `User ${msg.receiver_id}`;
    }
    return `User ${msg.receiver_id}`;
  };



return (
  <div className="flex flex-col h-screen bg-[#fef3e2]">
    {/* HEADER - Fixed at top */}
    <div className="sticky top-0 z-10 border-b border-[#820F17] bg-[#F5E9DC] flex items-center justify-between">
      <h2 className="text-xl font-semibold text-[#820F17]">{receiverEmail}</h2>
    </div>

    {/* MESSAGES - Scrollable middle */}
<div className="flex-1 overflow-y-auto space-y-3">
  {messages?.map((message) => {
    const isCurrentUserSender =
      message.receiver?.uid === receiverId || message.receiver_id === receiverId;

    return (
      <div
        key={message.id}
        className={`flex w-full ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`
            ${isCurrentUserSender ? ' text-transparent' : ' text-[#820F17]'}
            pl-2
          `}
        >
          <div className="sender-uid">{message.sender?.uid}</div>
          <div className="message-body-text">{message.body}</div>
        </div>
      </div>
    );
  })}
</div>

    {/* INPUT - Fixed at bottom */}
    <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="p-0">
        <label htmlFor="chat" className="sr-only">Your message</label>

        {/* Optional receiver input */}
        {showReceiverInput && !receiverId && !channelId && (
          <input
            type="number"
            required
            placeholder="User ID"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="mb-3 block w-full px-4 py-2 text-sm border rounded-lg border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
          />
        )}

        {/* Input Bar */}
        <div className="flex items-center py-2 bg-gray-50 dark:bg-gray-700">
          {/* Upload button */}
          <button type="button" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 18">
              <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
            </svg>
          </button>

          {/* Emoji button */}
          <button type="button" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z" />
            </svg>
          </button>

          {/* Message input */}
          <textarea
            id="chat"
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder={
              channelId 
                ? `Message #${channelId}...` 
                : receiverId 
                  ? `Message ${receiverEmail}...`
                  : "Your message..."
            }
            className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Send button */}
          <button type="submit" className="p-2 text-[#820F17] rounded-full hover:bg-[#820F17] hover:text-[#F5E9DC] transition">
            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 18 20">
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default Message;