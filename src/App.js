import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MintBadge from './components/MintBadge';
import MyBadges from './components/MyBadges';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MintBadge />} />
          <Route path="/my-badges" element={<MyBadges />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
