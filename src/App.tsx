import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StockReceived } from './components/StockReceived';
import { StockIssued } from './components/StockIssued';
import { StockBalance } from './components/StockBalance';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import Logout from './components/Logout';

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const AuthenticatedRoutes = () => (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<StockBalance />} />
        <Route path="/received" element={<StockReceived />} />
        <Route path="/issued" element={<StockIssued />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );

  const UnauthenticatedRoutes = () => (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );

  return (
    <Router>
      {token ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </Router>
  );
}

export default App;
