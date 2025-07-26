import { useEffect, useState } from 'react';
import { useData } from '../../context/DataProvider';
import axios from 'axios';
import UserList from '../UserList/UserList';

const API_URL = import.meta.env.VITE_API_URL;

function Sidebar({ onChannelSelect, selectedChannelId }) {
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const { userHeaders } = useData();

  // Fetch user - keeping your existing pattern
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
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    if (!user) fetchUser();
  }, [user, userHeaders]);

  // Get channels - using axios like signup
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

  // Create channel - EXACTLY like your signup structure
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create the object first (like signup)
      const newChannel = {
        name: newChannelName,
        user_ids: []
      };

      // Use axios.post with headers (exactly like signup)
      const requestHeaders = {
        headers: userHeaders
      };

      await axios.post(`${API_URL}/channels`, newChannel, requestHeaders);

      // Success feedback (like signup)
      alert("Channel created successfully!");
      setNewChannelName(""); // Clear form (like signup clearing fields)
      setShowCreateForm(false);
      
      // Refresh the channels list
      getChannels();
      
    } catch (error) {
      alert("Channel creation failed. Please try again.");
      console.error(error);
    }
  };

  // Load channels when component mounts
  useEffect(() => {
    getChannels();
  }, [userHeaders]);

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Channels</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-channel-btn"
            title="Create new channel"
          >
            +
          </button>
        </div>

        {/* Create Channel Form - same structure as signup form */}
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
                Create Channel
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

        {/* Channels List */}
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
        <h1 className="sidebar-title">Private messages</h1>
        <div className="pm-list">
          <UserList />
        </div>
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