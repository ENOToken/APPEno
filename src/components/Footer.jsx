import React from 'react'
/* ============ FONT A W E S O M E ============ */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faFacebook,
   faYoutube,
   faLinkedinIn,
   faXTwitter,
   faInstagram,
   faDiscord,
   faTelegram,
   faRedditAlien,
} from "@fortawesome/free-brands-svg-icons";

import enologo from '../assets/ENOLogo.svg';
import enologoNegativo from "../assets/EnoLogoNegativo.webp";

function Footer() {
   return (

      <div className="footer__content">
         <div className="footer__left">
            <div className="logo">
               <img src={enologoNegativo} alt="ENO Logo" className='enologo'/>
               <img src={enologo} alt="ENO Logo" className='enologoNegativo'/>
               <span className='span__footer'>Where friends, families and dreams unite</span>
               <div className="global__icons">
                  <a href="https://www.youtube.com/channel/UClFLsvU78zRxuI-q4_WT4-g/videos" target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faTelegram} />
                  </a>
                  <a href="https://www.youtube.com/channel/UClFLsvU78zRxuI-q4_WT4-g/videos" target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faDiscord} />
                  </a>
                  <a href="https://www.youtube.com/channel/UClFLsvU78zRxuI-q4_WT4-g/videos" target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faRedditAlien} />
                  </a>
                  <a href="https://www.youtube.com/channel/UClFLsvU78zRxuI-q4_WT4-g/videos" target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                  <a href="https://www.youtube.com/channel/UClFLsvU78zRxuI-q4_WT4-g/videos" target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                  <a href="https://www.youtube.com/channel/UClFLsvU78zRxuI-q4_WT4-g/videos" target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faYoutube} />
                  </a>
                  <a href="https://www.youtube.com/channel/UClFLsvU78zRxuI-q4_WT4-g/videos" target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="https://www.youtube.com/channel/UClFLsvU78zRxuI-q4_WT4-g/videos" target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faFacebook} />
                  </a>
               </div>
            </div>
         </div>
         <div className="footer__right">
            <div className="social-icon-box">
               <div className="social__links">
                  <div className="social__footer">

                     {/* Support | Discord */}
                     <div className="socials">
                        <p className='footer__link'>Support</p>
                        <a className='name__link'>Discord</a>
                     </div>

                     {/* Learn | Medium */}
                     <div className="socials">
                        <p className='footer__link'>Learn</p>
                        <a className='name__link'>Medium</a>
                     </div>

                     {/* News | Blog */}
                     <div className="socials">
                        <p className='footer__link'>News</p>
                        <a className='name__link'>Blog</a>
                     </div>

                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Footer