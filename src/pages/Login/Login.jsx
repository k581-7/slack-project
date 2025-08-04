import { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataProvider';
import pingslyLogo from '../../assets/pingsly_nobg.png';

const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleHeaders } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginCredentials = { email, password };
      const response = await axios.post(`${API_URL}/auth/sign_in`, loginCredentials);
      const { data, headers } = response;

      // console.log('=== LOGIN DEBUG ===');
      // console.log('Full response:', response);
      // console.log('Response data:', data);
      // console.log('Response headers:', headers);

      if (data.data && headers) {
        // Store headers in context
        handleHeaders(headers);

        const token =
          headers['access-token'] ||
          headers['authorization'] ||
          data.data.token ||
          data.token;

        const userData = data.data;

        // console.log('Extracted token:', token?.substring(0, 20) + '...');
        // console.log('User data:', userData);

        if (token) {
          onLogin(token, userData);
          navigate('/');
        } else {
          throw new Error('No token received from server');
        }
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      alert('Invalid email or password!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {!showForm && (
          <>
            <p className="start-message">Click the button to sign in</p>
            <button className="slack-btn" onClick={() => setShowForm(true)}>
              Sign-in to Pingsly
            </button>
            <p className="signup-redirect">
              New to Pingsly?{' '}
              <span onClick={() => navigate('/signup')} className="signup-link">
                Create an account
              </span>
            </p>
          </>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="login-form">
            <h2><img src={pingslyLogo} align="left" alt="Pingsly Logo"/>Pingsly </h2>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Your e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div id="forgot-credentials">
              <a href="https://slack-api.up.railway.app/api/v1/users">
                Forgot email or password?
              </a>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Start messaging 🗪'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
