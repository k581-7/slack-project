import { useState, useEffect } from "react";
import { useData } from "../../context/DataProvider";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Message({ receiverId = null, receiverType = "User", channelId = null, showReceiverInput = false, messages, setMessages }) {
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

  
// const handleReceiver = (etv) => {
//  console.log('Receiver Target: ', etv);
//  setReceiver(etv);
//  console.log('After Set RT: ', receiverId);
// } 


return (
  <div className="flex-1 flex flex-col">
    {/* Scrollable message container */}
    <div className="flex-grow overflow-y-auto p-4">
      <div className="mb-4 space-y-2">
        {messages?.map((message) => {
        const isCurrentUserSender = message.receiver?.uid === receiverId || message.receiver_id === receiverId;
          return (
            <div
              key={message.id}
              className={`flex items-center w-full ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}>
              <div className={`w-3/4 rounded-md border border-[#820F17] p-2 ${isCurrentUserSender ? 'bg-blue-500 text-white' : 'bg-white text-[#820F17]'}`}>
                <p className="opacity-60 text-sm">{message.sender?.uid}</p>
                <p>{message.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Message form */}
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white dark:bg-gray-800">
      <label htmlFor="chat" className="sr-only">Your message</label>

      {/* Receiver input (optional) */}
      {showReceiverInput && !receiverId && !channelId && (
        <input
          type="number"
          required
          placeholder="User ID"
          value={receiver}
          onChange={(e) => handleReceiver(e.target.value)}
          className="mb-3 block w-full px-4 py-2 text-sm border rounded-lg border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
        />
      )}

      <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
        {/* Upload Button */}
        <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
          </svg>
          <span className="sr-only">Upload image</span>
        </button>

        {/* Emoji Button */}
        <button type="button" className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z" />
          </svg>
          <span className="sr-only">Add emoji</span>
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
                ? `Message ${receiverId}...`
                : "Your message..."
          }
          className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />

        {/* Send button */}
        <button type="submit" className="inline-flex justify-center p-2 text-[#820F17] rounded-full hover:bg-[#820F17] hover:text-[#F5E9DC] transition">
          <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 18 20" xmlns="http://www.w3.org/2000/svg">
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  </div>
);
}

export default Message;