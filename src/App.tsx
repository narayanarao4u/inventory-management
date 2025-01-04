import  { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StockReceived } from './components/StockReceived';
import { StockIssued } from './components/StockIssued';
import { StockBalance } from './components/StockBalance';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import Logout from './components/Logout';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token); // Store token in localStorage
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setToken(null);
  };

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<StockBalance />} />
          <Route path="/received" element={<StockReceived />} />
          <Route path="/issued" element={<StockIssued />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;