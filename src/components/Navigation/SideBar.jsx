import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('https://slack-api.up.railway.app/api/v1/auth/validate_token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'access-token': localStorage.getItem('access-token'),
            'client': localStorage.getItem('client'),
            'uid': localStorage.getItem('uid'),
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

    fetchUser();
  }, []);

  return (
    <div className="sidebar">
      <div>
        <h1 className="sidebar-title">Channels</h1>
        <ul className="channel-list">
          <li>
            <Link to="/channel/1" className="channel-link">
              # General
            </Link>
          </li>
          <li>
            <Link to="/channel/2" className="channel-link">
              # Random
            </Link>
          </li>
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
