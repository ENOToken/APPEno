// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MintBadge from './components/MintBadge';
import MyBadges from './components/MyBadges';
import MyNFT from './components/MyNFT';
import Launchpad from './components/NFTPurchase';
import NFTPurchaseDetails from './components/NFTPurchaseDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import NFTDetailView from './components/NFTDetailView'; 
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);
  const [navBarVisible, setNavBarVisible] = useState(true);

  return (
    <ChakraProvider>
      <Router>
        {headerVisible && <Header />}
        <Routes>
          <Route path="/mint-badges" element={<MintBadge />} />
          <Route path="/my-badges" element={<MyBadges />} />
          <Route path="/my-nft" element={<MyNFT />} />
          <Route path="/nft/:contractAddress" element={<NFTPurchaseDetails />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/" element={<Navigate replace to="/launchpad" />} />
          <Route path="/nft-detail/:nftId" element={
            <NFTDetailView 
              setHeaderVisible={setHeaderVisible} 
              setFooterVisible={setFooterVisible} 
              setNavBarVisible={setNavBarVisible} 
            />
          } /> {/* Nueva ruta */}
        </Routes>
        {navBarVisible && <NavBar />}
        {footerVisible && <Footer />}
      </Router>
    </ChakraProvider>
  );
}

export default App;
