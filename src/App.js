import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Importa Navigate
import Header from './components/Header';
import MintBadge from './components/MintBadge';
import MyBadges from './components/MyBadges';
import Launchpad from './components/NFTPurchase';
import NFTPurchaseDetails from './components/NFTPurchaseDetails';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/mint-badges" element={<MintBadge />} />
          <Route path="/my-badges" element={<MyBadges />} />
          <Route path="/nft/:contractAddress" element={<NFTPurchaseDetails />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/" element={<Navigate replace to="/launchpad" />} /> {/* Redirige desde la raíz a /launchpad */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
