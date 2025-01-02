import  { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StockReceived } from './components/StockReceived';
import { StockIssued } from './components/StockIssued';
import { StockBalance } from './components/StockBalance';
import { Login } from './components/Login';
import { Signup } from './components/Signup';

function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (token: string) => {
    setToken(token);
  };

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;