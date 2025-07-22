import Login from './pages/Login/login.jsx';
import Message from './pages/Message/Message.jsx';
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import DataProvider from './context/DataProvider';

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
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </div>
  );
}

export default App;
