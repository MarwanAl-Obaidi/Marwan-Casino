import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './views/home/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
