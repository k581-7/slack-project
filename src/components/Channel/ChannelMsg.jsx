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

  // Fetch messages for this channel
  const getChannelMessages = async () => {
    if (!channel?.id) return;
    try {
      const response = await axios.get(`${API_URL}/messages`, {
        params: {  //query string parameters na ipinapasa sa URL ng GET request
          receiver_id: channel.id,
          receiver_class: 'Channel'
        },
        headers: userHeaders
      });
      setMessages(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  // Fetch members of this channel
  const fetchChannelMembers = async () => {
    if (!channel?.id) return;
    try {
      const response = await axios.get(`${API_URL}/channels/${channel.id}`, {
        headers: userHeaders
      });
      const channelMembers = response?.data?.data.channel_members;

      const filteredMembers = channelMembers.map((member) => {
        return allUsers.find((user) => user.id === member.user_id);
      }).filter(Boolean); //tinatanggal ang mga undefined sa array

      setChannelMembers(filteredMembers);
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
        // alert("✅ Successfully sent a message!");
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
      fetchChannelMembers();
      alert("User added successfully!");
    } catch (error) {
      alert("Failed to add user");
    }
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}
      <div className="border-b border-[#820F17] p-4 bg-[#F5E9DC] flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#820F17]">#{channel.name}</h2>

        {/* Member Dropdown */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="channel-members-btn">
            Members <FontAwesomeIcon icon={faPeopleGroup} />
          </button>

          {isOpen && (
            <div className="channel-members-dropdown">
              <ul className="py-2 text-sm text-[#FFE6D3]">
                {channelMembers.length > 0 ? (
                  channelMembers.map((member) => (
                    <li key={member.id}>
                      <p>{member.email}</p>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-400 italic">No members</li>
                )}
              </ul>
              <div className="p-2">
                <button onClick={handleAddMember} className="add-member-btn">
                  + Add Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="mb-4 space-y-2">
          {messages.map((msg) => {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="w-3/4 rounded-md px-4 py-2 bg-[#F5E9DC] text-[#820F17]">
                  <p className="sender-uid text-[#D15734]">{msg.sender?.uid}</p>
                  <p className="message-body-text">{msg.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">

          {/* Upload Button */}
         <button type="button" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 18">
              <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
            </svg>
          </button>

          {/* Emoji Button */}
          <button type="button" className="p-2 text-gray-500 hover:text-gray-900">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z" />
            </svg>
            <span className="sr-only">Add emoji</span>
          </button>

          {/* Textarea */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            required
            rows="1"
            className="block mx-4 p-2.5 w-full text-sm bg-gray border border-gray-300 rounded-lg"
          />

          {/* Send Button */}
          <button type="submit" className="p-2 text-[#820F17] hover:bg-[#820F17] hover:text-[#F5E9DC] rounded-full transition">
            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 18 20">
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>

      {/* Add Member Modal */}
      {showUserModal && (
        <div className="absolute top-16 right-4 z-50 bg-[#D15734] border border-gray-300 rounded-lg shadow-lg w-64 max-h-64 overflow-y-auto">
          <div className="p-4">
            <UserList onUserSelect={addUserToChannel} />
            <button
              onClick={() => setShowUserModal(false)}
              className="close-btn"
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
