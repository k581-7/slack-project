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
      const response = await axios.get(`${API_URL}/messages`, {
        params: {
          receiver_id: channel.id,
          receiver_class: 'Channel'
        },
        headers: {
          client: userHeaders.client,
          uid: userHeaders.uid,
          expiry: userHeaders.expiry,
          'access-token': userHeaders['access-token']
        }
      });
      const { data } = response;
      setMessages(data.data || []);
    } catch (error) {
      console.error("Cannot get channel messages:", error);
    }
  };

  useEffect(() => {
    getChannelMessages()
  }, [channel])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      id: Date.now(),
      receiver_id: channel.id,
      receiver_type: 'Channel',
      body: message,
    };

    setMessage("");
    setMessages((prev) => [...prev, newMessage]);

    try {
      const requestBody = {
        receiver_id: channel.id,
        receiver_class: 'Channel',
        body: message,
      };

      const requestHeaders = {
        headers: userHeaders,
      };

      const response = await axios.post(`${API_URL}/messages`, requestBody, requestHeaders);
      const { data } = response;

      if (data.data) {
        console.log(data.data);
        alert("✅ Successfully sent a message!");
      }
    } catch (error) {
      alert(`${error}❌ Cannot send message`);
    }
  };

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

      <div className="flex-grow">
        <div className="mb-4 space-y-2">
          {messages !== undefined ? messages.map(message => {
            const isReceiver = message.receiver?.ownerId !== channel.id;
            return (
              <div
                key={message.id}
                className={`flex items-center w-full ${isReceiver ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`w-3/4 rounded-md border ${isReceiver ? 'bg-white' : 'bg-blue-500'}`}>
                  <p className="opacity-60">{message.sender?.uid}</p>
                  <p>{message.body}</p>
                </div>
              </div>
            )
          }) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="chat" className="sr-only">Your message</label>

        {/* Chat UI Layout */}
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

          {/* Message Input */}
          <textarea
            id="chat"
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Channel Message Input"
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          {/* Send Button */}
          <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
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

export default ChannelMessage;