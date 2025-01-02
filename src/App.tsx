import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StockReceived } from './components/StockReceived';
import { StockIssued } from './components/StockIssued';
import { StockBalance } from './components/StockBalance';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<StockBalance />} />
          <Route path="/received" element={<StockReceived />} />
          <Route path="/issued" element={<StockIssued />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;