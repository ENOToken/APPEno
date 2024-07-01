import React, { useState, useEffect } from 'react';
import { useToast, Button } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import NFTPurchaseCard from './NFTPurchaseCard';
import badgesNFT from '../assets/badgesNFT.mp4'; // Asegúrate de importar el archivo de video correctamente
import '../App.css';
import './NFTPurchase.css';
import nftAbi from '../ABIs/nftAbi.json';

const NFTPurchase = () => {
  const toast = useToast();
  const [nfts, setNfts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const response = await fetch('/nftData.json');
        const data = await response.json();
        const nftArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setNfts(nftArray);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
        toast({
          title: 'Error',
          description: 'There was an error loading the NFT data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchNFTData();
  }, [toast]);

  useEffect(() => {
    const checkMetaMaskInstallation = () => {
      setIsMetaMaskInstalled(typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined');
    };

    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking MetaMask connection:', error);
        }
      }
    };

    checkMetaMaskInstallation();
    checkConnection();
  }, []);

  const handleConnect = async () => {
    if (isMetaMaskInstalled) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        toast({
          title: 'Connected',
          description: 'MetaMask connected successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error connecting MetaMask:', error);
        toast({
          title: 'Error',
          description: 'There was an error connecting to MetaMask.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'MetaMask not installed',
        description: 'Please install a web3 compatible Wallet to proceed.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="install-metamask-container">
        <Button as="a" href="https://metamask.io/download.html" target="_blank" colorScheme="teal" size="lg">
          Install Wallet
        </Button>
        <p className="install-message">Please install a web3 compatible wallet to proceed.</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="connect-container">
        <Button onClick={handleConnect} colorScheme="teal" size="lg">
          Connect Wallet
        </Button>
        <p className="connect-message">Please connect your wallet.</p>
      </div>
    );
  }

  const handleGetNFTClick = (nftId) => {
    navigate(`/nft-detail/${nftId}`);
  };

  return (
    <div className="container">
      <h2 className="hero__title">Discover our NFT Collection</h2>

      <Link to="/my-nft">
        <Button colorScheme="teal" size="md" ml="4">
          My NFTs
        </Button>
      </Link>

      <div className="nft-grid">
        {nfts.map((nft) => (
          <NFTPurchaseCard
            key={nft.contractAddress}
            nft={nft}
            onGetNFTClick={() => handleGetNFTClick(nft.id)}
          />
        ))}
      </div>

      {/* What Are Eno Badges - Video Section */}
      <section className="EnoBadges">
        <div className="EnoBadges__left">
          <h2 className="hero__title">What are ENO NFTs?</h2>
          <p className="text__subtitle">ENO‘s Badges are NFTs that verify your participation in an activity within our social ecosystem.</p>
          <a href="https://docs.enotoken.io/" target="_blank" rel="noopener noreferrer" className='button__NFT'>
            <button className="hero__btn-alternate color-1">
              Read More in Whitepaper
            </button>
          </a>
        </div>
        <div className="EnoBadges__right">
          <div className='backBadges'>
            <video src={badgesNFT} autoPlay loop muted className='layer'></video>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NFTPurchase;
