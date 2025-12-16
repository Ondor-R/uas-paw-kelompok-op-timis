import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Products from './Products';
import Transactions from './Transactions';
import Suppliers from './Suppliers';
import Reports from './Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        ,{/* route-route nya*/}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;
