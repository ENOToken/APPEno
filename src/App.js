import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import MintBadge from './components/MintBadge';
import MyBadges from './components/MyBadges';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MintBadge />} />
        <Route path="/my-badges" element={<MyBadges />} />
      </Routes>
    </Router>
  );
}

export default App;
