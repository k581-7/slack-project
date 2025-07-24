import { useState } from 'react';
import './Login.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataProvider";

const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { handleHeaders } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginCredentials = { email, password };
      const response = await axios.post(`${API_URL}/auth/sign_in`, loginCredentials);
      const { data, headers } = response;
      if (data.data && headers) {
        handleHeaders(headers);
        onLogin(true);
        navigate('/');
      }
    } catch (error) {
      alert('Invalid email or password!');
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
      New to Pingsly?{" "}
        <span onClick={() => navigate("/signup")} className="signup-link">
          Create an account
          </span>
          </p>

          </>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Pingsly</h2>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="text"
                placeholder="Your e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div id="forgot-credentials">
              <a href="https://slack-api.up.railway.app/api/v1/users">Forgot email or password?</a>
            </div>

            <button type="submit">Start messaging 🗪</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
