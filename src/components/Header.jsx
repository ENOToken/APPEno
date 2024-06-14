import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import enoLogo from '../assets/ENOLogo.svg';
import { useNetworkSwitcher } from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { changeNetwork, testnet } = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message, balance } = useMetaMaskConnector();
  const toast = useToast();

  // Formatear la dirección de la wallet
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Copiar la dirección de la wallet
  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        toast({
          title: 'Wallet address copied',
          description: 'The wallet address has been copied to clipboard.',
          status: 'success',
          duration: 5000,
        });
      })
      .catch((err) => {
        console.error('Failed to copy wallet address: ', err);
        toast({
          title: 'Failed to copy',
          description: 'An error occurred while copying the wallet address.',
          status: 'error',
          duration: 5000,
        });
      });
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
          <div className="wallet-container" onClick={() => copyToClipboard(window.ethereum.selectedAddress)}>
            <div className="wallet-info">
              <span className="wallet-address">{formatWalletAddress(window.ethereum.selectedAddress)}</span>
              <span className="wallet-balance">{balance} ENO</span>
            </div>
          </div>
        ) : (
          <button onClick={connectMetaMask} className="connect-btn">
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
