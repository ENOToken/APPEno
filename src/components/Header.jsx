//Header.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import enoLogo from '../assets/ENOLogo.svg';
import { useNetworkSwitcher, chain } from '../hooks/useNetworkSwitcher';

import useMetaMaskConnector from '../hooks/useMetaMaskConnector';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { changeNetwork, testnet } = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector();

  // Función para formatear la dirección de la wallet
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  // Botones de navegación
  const navButtons = (
    <>
      <Link to="/launchpad" className="secondary-btn" onClick={() => setIsMenuOpen(false)}>Launchpad</Link>
      <Link to="/mint-badges" className="secondary-btn" onClick={() => setIsMenuOpen(false)}>Badges</Link>
    </>
  );

  return (
    <header className="site-header">
      <a href="./" rel="noreferrer" target="_blank">
        <img src={enoLogo} alt="ENOLogo" className="logo" />
      </a>
      {testnet && <span className="testnet-indicator">Testnet ON</span>}
      {/* Overlay para móvil */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      {/* Menú para móvil */}
      <nav className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {navButtons}
      </nav>
      {/* Botones para pantallas más grandes */}
      <div className="header-center">
        {navButtons}
      </div>
      {/* Sección de conexión a MetaMask */}
      <div className="wallet-section">
        {isConnected ? (
          <div className="wallet-address">
            {formatWalletAddress(window.ethereum.selectedAddress)}
          </div>
        ) : (
          <>
          </>
/*           <button onClick={connectMetaMask} className="connect-btn">
            Connect Wallet
          </button> */
        )}
      </div>
    </header>
  );
}

export default Header;
