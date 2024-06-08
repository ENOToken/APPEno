import React, { useState, useEffect } from 'react';
import { useToast, Button } from '@chakra-ui/react';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useNetworkSwitcher, chain } from '../hooks/useNetworkSwitcher';
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

// Imágenes
const ChampagneCarbon = 'https://storage.googleapis.com/intercellar-assets/Champagne-Carbon.mp4';
const CoquerelCalvados = 'https://storage.googleapis.com/intercellar-assets/Coquerel%20fixed.mp4';

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
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector();
  const { currentNetwork, changeNetwork, error } = useNetworkSwitcher();
  const toast = useToast();
  const [nfts, setNfts] = useState(initialNFTs);

  useEffect(() => {
    if (error) {
      toast({
        title: 'INFO',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleConnect = async () => {
    try {
      await connectMetaMask();
      await changeNetwork();
    } catch (error) {
      console.error('Failed to connect MetaMask and switch network:', error);
    }
  };

  const renderConnectMessage = () => {
    if (!isConnected && currentNetwork !== chain) {
      return 'Please connect your wallet and switch to the correct network.';
    } else if (!isConnected) {
      return 'Please connect your wallet.';
    } else if (currentNetwork !== chain) {
      return 'Please switch to the correct network.';
    }
    return '';
  };

  const renderConnectButtonLabel = () => {
    if (!isConnected) {
      return 'Connect Wallet';
    } else if (currentNetwork !== chain) {
      return 'Change Network';
    }
    return '';
  };

  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };

  if (!isMetaMaskInstalled()) {
    return (
      <div className="connect-container">
        <Button as="a" href="https://metamask.io/download.html" target="_blank" colorScheme="teal" size="lg">
          Install MetaMask
        </Button>
        <p className="install-message">Please install MetaMask to proceed.</p>
      </div>
    );
  }

  if (!isConnected || currentNetwork !== chain) {
    return (
      <div className="connect-container">
        <Button onClick={handleConnect} colorScheme="teal" size="lg">
          {renderConnectButtonLabel()}
        </Button>
        <p className="connect-message">{renderConnectMessage()}</p>
      </div>
    );
  }

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
