// src/components/NavBar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faThLarge } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  return (
    <header className="NavBar" id="NavBar">
      <nav className="nav element">
        

        <div className="nav__menu" id="nav-menu">
          <ul className="nav__list">

            <li className="nav__item">
              <a href="/mint-badges" className="nav__link">
                <FontAwesomeIcon icon={faLink} size="2x" />
                <span className="nav__name">Badges</span>
              </a>
            </li>

            {/* <li className="nav__item">
              <a href="/launchpad" className="nav__link">
                <FontAwesomeIcon icon={faThLarge} size="2x" />
                <span className="nav__name">Launchpad</span>
              </a>
            </li> */}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
