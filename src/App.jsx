import Login from './pages/Login/login.jsx';
import './index.css';
import Message from './pages/Message/Message.jsx';
import Chat from './components/Chat/Chat.jsx';
import Signup from './pages/Login/SignUp.jsx';
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import DataProvider from './context/DataProvider';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated
                  ? <Navigate to="/" replace />
                  : <Login onLogin={handleLogin} />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/message"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Message />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
