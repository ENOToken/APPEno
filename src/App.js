// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MintBadge from './components/MintBadge';
import MyBadges from './components/MyBadges';
import MyNFT from './components/MyNFT';
import Launchpad from './components/NFTPurchase';
import NFTPurchaseDetails from './components/NFTPurchaseDetails';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import NFTDetailView from './components/NFTDetailView'; // Importa el nuevo componente
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/mint-badges" element={<MintBadge />} />
          <Route path="/my-badges" element={<MyBadges />} />
          <Route path="/my-nft" element={<MyNFT />} />
          <Route path="/nft/:contractAddress" element={<NFTPurchaseDetails />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/" element={<Navigate replace to="/launchpad" />} />
          <Route path="/nft-detail/:nftId" element={<NFTDetailView />} /> {/* Nueva ruta */}
        </Routes>
        <NavBar />
        <Footer />
      </Router>
    </ChakraProvider>
  );
}

export default App;
