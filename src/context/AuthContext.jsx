import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken') || 
                      localStorage.getItem('token') ||
                      localStorage.getItem('accessToken');
    
    if (savedToken) {
      console.log('Found saved token, auto-logging in...');
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token, userData = null) => {
    console.log('Login successful, storing token...');
    setAuthToken(token);
    setIsAuthenticated(true);
    setUser(userData);
    
    // Store token in localStorage for persistence
    localStorage.setItem('authToken', token);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear stored token
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
  };

  const authValue = {
    isAuthenticated,
    authToken,
    user,
    setUser,
    handleLogin,
    handleLogout
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};