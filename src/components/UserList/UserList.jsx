import { useEffect, useState } from 'react';
import { useData } from '../../context/DataProvider';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function UserList({ limit = null, showSearch = false }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { userHeaders } = useData();

  // Fetch users from API
  const getUsers = async () => {
    try {
      setLoading(true);
      const requestHeaders = {
        headers: userHeaders
      };
      
      const response = await axios.get(`${API_URL}/users`, requestHeaders);
      const { data } = response;
      const userList = data.data || [];
      
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      console.error("Cannot get users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.uid?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  useEffect(() => {
    getUsers();
  }, [userHeaders]);

  // Get users to display (with limit if specified)
  const usersToDisplay = limit ? filteredUsers.slice(0, limit) : filteredUsers;

  if (loading) {
    return <div className="user-list-loading">Loading users...</div>;
  }

  return (
    <div className="user-list-container">
      {/* Search input - only show when showSearch is true */}
      {showSearch && (
        <div className="user-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="user-search-input"
          />
        </div>
      )}

      {/* Users list */}
      <ul className="user-list">
        {usersToDisplay.length > 0 ? (
          usersToDisplay.map((user) => (
            <li key={user.id} className="user-item">
              <div 
                className="user-link"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  // Handle user selection for private messages
                  console.log('Selected user:', user);
                }}
              >
                <div className="user-info">
                  <span className="user-name">
                    {user.name || user.email || user.uid}
                  </span>
                  {user.email && user.name && (
                    <span className="user-email">{user.email}</span>
                  )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="no-users">
            {searchQuery ? 'No users found matching your search.' : 'No users available.'}
          </li>
        )}
      </ul>

      {/* Show count if limited and there are more users */}
      {limit && filteredUsers.length > limit && !showSearch && (
        <div className="user-count">
          Showing {limit} of {filteredUsers.length} users
        </div>
      )}
    </div>
  );
}

export default UserList;