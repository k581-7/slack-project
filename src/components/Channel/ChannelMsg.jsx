import { useState, useEffect, useRef } from "react";
import { useData } from "../../context/DataProvider";
import axios from "axios";
import UserList from "../UserList/UserList";
import './ChannelMsg.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

const API_URL = import.meta.env.VITE_API_URL;

function ChannelMessage({ channel }) {
  const { userHeaders, allUsers } = useData();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [channelMembers, setChannelMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getChannelMessages = async () => {
    if (!channel?.id) return;
    try {
      const response = await axios.get(`${API_URL}/messages`, {
        params: {
          receiver_id: channel.id,
          receiver_class: 'Channel'
        },
        headers: userHeaders
      });
      setMessages(response.data.data || []);
    } catch (error) {
      console.error("Cannot get channel messages:", error);
    }
  };

  const fetchChannelMembers = async () => {
    if (!channel?.id) return;
    try {
      const response = await axios.get(`${API_URL}/channels/${channel.id}`, {
        headers: userHeaders
      });
      const channelMembers = response?.data?.data.channel_members;
const filteredMembers = [];
const memberEmails = channelMembers.forEach((member) => {
  const user = allUsers.filter((user) => {
    return user.id === member.user_id;
  });

  filteredMembers.push(user[0]);
});
setChannelMembers(filteredMembers);

      // setChannelMembers(response.data.data.channel_members || []);
      console.log({filteredMembers});
    } catch (err) {
      console.error("Failed to fetch channel members:", err);
    }
  };


  useEffect(() => {
    getChannelMessages();
    fetchChannelMembers();
  }, [channel]);

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
      const response = await axios.post(`${API_URL}/messages`, {
        receiver_id: channel.id,
        receiver_class: 'Channel',
        body: message,
      }, { headers: userHeaders });

      if (response.data.data) {
        alert("✅ Successfully sent a message!");
      }
    } catch (error) {
      alert(`${error} ❌ Cannot send message`);
    }
  };

  const handleAddMember = () => {
    setShowUserModal(true);
  };

  const addUserToChannel = async (selectedUser) => {
    try {
      await axios.post(`${API_URL}/channel/add_member`, {
        member_id: selectedUser.id,
        id: channel.id
      }, { headers: userHeaders });

      setShowUserModal(false);
      fetchChannelMembers(); // refresh list
      alert("User added successfully!");
    } catch (error) {
      alert("Failed to add user");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-[#820F17] p-4 bg-[#F5E9DC] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#820F17]">#{channel.name}</h2>
        </div>

        {/* Dropdown */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="channel-members-btn">
            Members <FontAwesomeIcon icon={faPeopleGroup}/>  
          </button>
          
          
          {isOpen && (
            <div className="channel-members-dropdown">
               <ul className="py-2 text-sm text-[#FFE6D3] justify-center">
                {channelMembers.map((member) => (
                <div key={member.id}> 
              <p> {member.email} </p> 
                </div> 
                ))}
                {channelMembers.length === 0 && (
                  <li className="px-4 py-2 text-gray-400 italic">No members</li>
                )}
              </ul>
              <div className="p-2">
                <button
                  onClick={handleAddMember}
                  className="add-member-btn"
                >
                  + Add Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      

      {/* Messages */}
      <div className="flex-grow p-4">
        <div className="mb-4 space-y-2">
          {messages.map((message) => {
            const isReceiver = message.receiver?.ownerId !== channel.id;
            return (
              <div key={message.id} className={`flex ${isReceiver ? 'justify-start' : 'justify-start'}`}>
                <div className={`w-3/4 rounded-md px-4 py-2 ${isReceiver ? 'bg-transparent text-[#820F17]' : 'bg-white'}`}>
                  <p className="sender-uid">{message.sender?.uid}</p>
                  <p className="message-body-text">{message.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit}>
  <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
    
    {/* Upload Button */}
    <button
      type="button"
      className="inline-flex justify-center p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 18">
        <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
      </svg>
      <span className="sr-only">Upload image</span>
    </button>

    {/* Emoji Button */}
    <button
      type="button"
      className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
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
      placeholder={`Message #${channel.name}`}
      className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    />

    {/* Send Button */}
    <button
      type="submit"
      className="inline-flex justify-center p-2 text-[#820F17] rounded-full hover:bg-[#820F17] hover:text-[#F5E9DC] transition"
    >
      <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 18 20">
        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
      </svg>
      <span className="sr-only">Send message</span>
    </button>
  </div>
</form>

      

{showUserModal && (
  <div className="absolute top-16 right-4 z-50 bg-[#D15734] border border-gray-300 rounded-lg shadow-lg w-64 max-h-64 overflow-y-auto">
    <div className="p-4">
      <UserList onUserSelect={addUserToChannel} />
      <button
        onClick={() => setShowUserModal(false)}
        className="mt-2 text-xs text-[#D15734] hover:underline bg-white p-1 rounded"
      >
        Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelMessage;
