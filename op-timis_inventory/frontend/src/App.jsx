import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* nnti tambah route dashboard di sini */}
      </Routes>
    </Router>
  );
}

export default App;
