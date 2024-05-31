// src/components/NFTPurchase.jsx
import React, { useState, useEffect } from 'react';
import { useToast, Spinner, Flex, Button } from '@chakra-ui/react';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { Link } from 'react-router-dom';
import NFTPurchaseCard from './NFTPurchaseCard';
import '../App.css';
import demo from '../assets/BlackBox.mp4';
import enologo from '../assets/ENOLogo.svg';

/* ============ FONT A W E S O M E ============ */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faLinkedin,
  faXTwitter,
  faInstagram,
  faDiscord,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";

//imagenes
const ChampagneCarbon = 'https://storage.googleapis.com/intercellar-assets/Champagne-Carbon.mp4';
const CoquerelCalvados = 'https://storage.googleapis.com/intercellar-assets/Coquerel%20fixed.mp4'

/* const usdtContractAddress = "0x0997ff490B1cA814C55eB0854A0969431fCDaa1e"; */

export const initialNFTs = [
  {
    title: "Champagne Carbon",
    image: ChampagneCarbon,
    contractAddress: "0x543eaf118C5B2667f70AFf54860262Eb1c199E9c"
  },
  {
    title: "Coquerel Calvados",
    image: CoquerelCalvados,
    contractAddress: "0x543eaf118C5B2667f70AFf54860262Eb1c199E9c"
  }
];

const NFTPurchase = () => {
  const { isConnected, connectMetaMask } = useMetaMaskConnector();
  const toast = useToast();
  const [nfts, setNfts] = useState(initialNFTs);

  useEffect(() => {
    if (!isConnected) {
      connectMetaMask();
    }
  }, [isConnected, connectMetaMask]);

  return (
    <div className="container">
      <h2 className="hero__title">Discover our NFT Collection</h2>

      <Link to="/my-nft">
        <Button colorScheme="teal" size="md" ml="4">
          My NFT's
        </Button>
      </Link>

      <div className="nft-grid">
        {nfts.map((nft) => (
          <Link to={`/nft-detail/${nft.title.toLowerCase().replace(/\s+/g, '-')}`} key={nft.contractAddress}>
            <NFTPurchaseCard key={nft.contractAddress} nft={nft} />
          </Link>
        ))}
      </div>

      {/* ======= What Are Eno Badges - Video ======= */}
      <section className="newspaper">
        <div className="newspaper__left">
          <h2 className="hero__title">What are ENO Badges?</h2>
          <p className="text__subtitle">ENO‘s Badges are NFTs that verify your participation in an activity within our social ecosystem.</p>
          <a href="https://docs.enotoken.io/" target="_blank" rel="noopener noreferrer" className='button__NFT'>
            <button className="hero__btn color-1">
              Read More in Whitepaper
            </button>
          </a>
        </div>
        <div className="newspaper__right">
          <video src={demo} autoPlay loop muted></video>
        </div>
      </section>
    </div>
  );
};

export default NFTPurchase;
