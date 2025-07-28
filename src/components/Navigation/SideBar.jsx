import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataProvider';
import axios from 'axios';
import './Sidebar.css';
import pingslyLogo from '../../assets/pingsly_nobg.png';


const API_URL = import.meta.env.VITE_API_URL;

function Sidebar({ onChannelSelect, selectedChannelId, onUserSelect, selectedUserId, setMessages }) {
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [showExpandedUserList, setShowExpandedUserList] = useState(false);
  const { userHeaders } = useData();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);

  const fetchConversation = async () => {
    try {
      // We fetch the conversation with the user by ID
      const conversation = await axios.get(`${API_URL}/messages`, {
        params: {
          receiver_id: selectedUserId,
          receiver_class: 'User'
        },
        headers: {
          client: userHeaders.client,
          uid: userHeaders.uid,
          expiry: userHeaders.expiry,
          'access-token': userHeaders['access-token']
        }
      });

      // We set the conversations to the conversation state
      setMessages(conversation?.data?.data);
      console.log(conversation?.data?.data);
    } catch (e) {
      // For now we log what the error is, if there's any.
      // This error should be handled gracefully, i.e. show a toast that says 'An unexpected error occured';
      // compare first if this error is in server side, if not, this should already be handled by the client
      console.error("Failed to retrieve conversation.")
    }
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('https://slack-api.up.railway.app/api/v1/auth/validate_token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...userHeaders,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        console.log("User data:", data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    if (!user) fetchUser();
  }, [user, userHeaders]);

  const getChannels = async () => {
    try {
      const requestHeaders = {
        headers: userHeaders
      };
      
      const response = await axios.get(`${API_URL}/channels`, requestHeaders);
      const { data } = response;
      setChannels(data.data || []);
    } catch (error) {
      console.error("Cannot get channels:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newChannel = {
        name: newChannelName,
        user_ids: []
      };

      const requestHeaders = {
        headers: userHeaders
      };

      await axios.post(`${API_URL}/channels`, newChannel, requestHeaders);

      alert("Channel created successfully!");
      setNewChannelName("");
      setShowCreateForm(false);
      
      getChannels();
      
    } catch (error) {
      alert("Channel creation failed. Please try again.");
      console.error(error);
    }
  };

useEffect(() => {
  if (userHeaders) getChannels();
}, [userHeaders]);

useEffect(() => {
  if (userHeaders) getUsers();
}, [userHeaders]);

useEffect(() => {
  if (selectedUserId === 0) return;

  fetchConversation()
}, [selectedUserId])

  const getUsers = async () => {
    try {
      const requestHeaders = {
        headers: userHeaders
      };
      
      const response = await axios.get(`${API_URL}/users`, requestHeaders);
      const { data } = response;
      setUsers(data.data || []);
    } catch (error) {
      console.error("Cannot get users:", error);
    }
  };
  
  return (
    <div className="sidebar">
      <div>
        <h1 className="side-bar-home">
          <Link to="/">
            <img src={pingslyLogo} alt="Pingsly Logo"/>
            Pingsly
          </Link>
        </h1>

        <div className="sidebar-header">
          <h2 className="sidebar-title">Channels</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-channel-btn"
            title="Create new channel"
          >
            +
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleSubmit} className="create-channel-form">
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Channel name"
              className="channel-input"
              required
            />
            <div className="form-actions">
              <button type="submit" className="btn-create">
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewChannelName("");
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <ul className="channel-list">
          {channels.length > 0 ? (
            channels.map((channel) => (
              <li key={channel.id}>
                <div
                  onClick={() => onChannelSelect && onChannelSelect(channel)}
                  className={`channel-link ${selectedChannelId === channel.id ? 'selected' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  # {channel.name}
                </div>
              </li>
            ))
          ) : (
            <li className="no-channels">
              No channels available. Create one to get started!
            </li>
          )}
        </ul>
      </div>

      <div>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Private messages</h2>
          <button
            onClick={() => setShowExpandedUserList(!showExpandedUserList)}
            className="show-user-btn"
            title={showExpandedUserList ? "Show less users" : "Show all users"}
          >
            {showExpandedUserList ? '−' : '+'}
          </button>
        </div>
        <ul className="user-list">
          {users.length > 0 ? (
            users
              .filter(userItem => userItem.id !== user?.data?.id)
              .slice(0, showExpandedUserList ? users.length : 12)
              .map((userItem) => (
                <li key={userItem.id}>
                  <div
                    onClick={() => onUserSelect && onUserSelect(userItem)}
                    className={`user-link ${selectedUserId === userItem.id ? 'selected' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {userItem.email || userItem.name || `User ${userItem.id}`}
                  </div>
                </li>
              ))
          ) : (
            <li className="no-users">
              No users available.
            </li>
          )}
        </ul>
      </div>

      <div className="user-info">
        {user?.data?.email ? (
          <div>
            Logged in as: <span className="user-email">{user.data.email}</span>
          </div>
        ) : (
          <div>Loading user...</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;