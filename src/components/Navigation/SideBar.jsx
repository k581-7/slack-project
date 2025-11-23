import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; //internal nav
import { useData } from '../../context/DataProvider';
import axios from 'axios';
import './Sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import pingslyLogo from '../../assets/pingsly_nobg.png';
import UserList from '../UserList/UserList';

const API_URL = import.meta.env.VITE_API_URL;

function Sidebar({ onChannelSelect, selectedChannelId, onUserSelect, selectedUserId, setMessages, onLogOut}) {
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [showExpandedUserList, setShowExpandedUserList] = useState(false);
  const { userHeaders } = useData();
  const [users, setUsers] = useState([]);
  const [recent, setRecent] = useState([]);



  const fetchConversation = async () => {
    try {
      const conversation = await axios.get(`${API_URL}/messages`, {
        params: {
          receiver_id: selectedUserId,
          receiver_class: 'User'
        },
        headers: userHeaders
      });
      setMessages(conversation?.data?.data);
    } catch (e) {
      console.error("Failed to retrieve conversation.")
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
  try {
    const response = await axios.get('https://slack-api.up.railway.app/api/v1/auth/validate_token', {
      headers: {
        'Content-Type': 'application/json',
        ...userHeaders,
      },
    });

    setUser(response.data); // Axios parses JSON 
    getRecent();
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

    if (!user) fetchUser(); //Kapag wala pang user sa state, saka lang siya magfe-fetch
  }, [user, userHeaders]); // pag nag bago login mag uulit code sa loob

  const getChannels = async () => {
    try {
      const response = await axios.get(`${API_URL}/channels`, { headers: userHeaders });
      const { data } = response;
      setChannels(data.data || []);
    } catch (error) {
      console.error("Cannot get channels:", error);
    }
  };

  const handleSubmit = async (e) => { //for channel creation
    e.preventDefault();

    try {
      const newChannel = { name: newChannelName, user_ids: [] };  //create new channel
      await axios.post(`${API_URL}/channels`, newChannel, { headers: userHeaders });
      alert("Channel created successfully!");
      setNewChannelName("");
      setShowCreateForm(false);
      getChannels();
    } catch (error) {
      alert("Channel creation failed. Please try again.");
    }
  };

  useEffect(() => { if (userHeaders) getChannels(); }, [userHeaders]);
  useEffect(() => { if (userHeaders) getUsers(); }, [userHeaders]);
  useEffect(() => { if (selectedUserId === 0) return; fetchConversation(); }, [selectedUserId]);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, { headers: userHeaders });
      const { data } = response;
      setUsers(data.data || []);
    } catch (error) {
      console.error("Cannot get users:", error);
    }
  };

  const getRecent = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/recent`, { headers: userHeaders });
      const { data } = response;
      setRecent(data.data || []);
    } catch (error) {
      console.error("Cannot get recent:", error);
    }
  };

  const RecentUsers = () => {
    const uniqueRecent = recent.filter((user, index, self) => index === self.findIndex((u) => u.id === user.id));
    return uniqueRecent.map((userItem) => (   // Ipa-map bawat natirang unique user para ipakita sa UI
      <li key={userItem.id}>
        <div
          onClick={() => onUserSelect && onUserSelect(userItem)}
          className={`user-link ${selectedUserId === userItem.id ? 'selected' : ''}`}  // for highlight
          style={{ cursor: 'pointer' }}
        >
          {userItem.email || userItem.name || `User ${userItem.id}`} 
        </div>
      </li>
    ));
  };

  return (
    <div className="sidebar">
      <div>
        <h1 className="side-bar-home">
          <Link>
            <img src={pingslyLogo} alt="Pingsly Logo" />
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
              <button type="submit" className="btn-create">Create</button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setNewChannelName(""); }}
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
            <li className="no-channels">No channels available. Create one to get started!</li>
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
            {showExpandedUserList ? '-' : '+'}
          </button>
        </div>
        <ul className="user-list overflow-y-auto max-h-[450px]">
          {users.length > 0 ? ( //checks if  may channel if meron, gow
            <>
              {!showExpandedUserList && <RecentUsers />}
              {showExpandedUserList && (
                <UserList onUserSelect={onUserSelect} showSearch={showExpandedUserList}/>
              )}
            </>
          ) : (
            <li className="no-users">No users available.</li> //else eto result
          )}
        </ul>
      </div>

      <div className="user-info">
        {user?.data?.email ? (
          <div>
            <FontAwesomeIcon icon={faUser}   /> <span className="user-email">{user.data.email}</span>
            <button onClick={onLogOut} className="logout-btn">
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </div>
        ) : (
          <div>Loading user...</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
