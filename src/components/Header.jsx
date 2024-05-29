import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import enoLogo from '../assets/ENOLogo.svg';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { changeNetwork, testnet } = useNetworkSwitcher();

  // Botones que se mostrarán tanto en el menú móvil como en pantallas más grandes
  const navButtons = (
    <>
      <Link to="/launchpad" className="secondary-btn" onClick={() => setIsMenuOpen(false)}>Launchpad</Link>
      <Link to="/mint-badges" className="secondary-btn" onClick={() => setIsMenuOpen(false)}>Badges</Link>
    </>
  );

  return (
    <header className="site-header">
      <a href="https://enotoken.io/" rel="noreferrer" target="_blank">
        <img src={enoLogo} alt="ENOLogo" className="logo" />
      </a>
      {testnet && <span className="testnet-indicator">Connected ON</span>} {/* Muestra un mensaje si testnet es true */}
      {/* <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        &#9776;
      </button>*}
      {/* Overlay para móvil */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      {/* Menú para móvil */}
      <nav className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {navButtons}
      </nav>
      {/* Botones para pantallas más grandes */}
      <div className="header-buttons">
        {navButtons}
      </div>
    </header>
  );
}

export default Header;
