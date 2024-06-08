import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import NFTCard from './NFTCard';
import erc721ABI from '../ABIs/mintBadgeParisABI.json';
import { useNetworkSwitcher, chain } from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useToast, Spinner, Flex, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import badgeImage from '../assets/badgepariseno.mp4';
import badgeBlackbox from '../assets/BlackBox.mp4';
import ImagesDuFuture from '../assets/ImagesDuFuture.mp4';
import BadgeBosqueReal from '../assets/BadgeBosqueReal.mp4';
import Blackbox12 from '../assets/BadgeBB2_BAJA.mp4';
import Unlock2024 from '../assets/UNLOCK.mp4';

const nftContractsMainnet = [
  '0x2A06B2c0999Af12C251c55D6E2c67330AeAb3C86',
  '0xD6C9365273539C7722EAb3BAC3D76dD3b23e6Ff3',
  '0x8cDff0DF63C816df0d1BbeC7f9e7771915311EDf',
  '0x3B70F7347Ed816CDE7A5B25c5AA9BdDE753e3966',
  '0x281d59301C137E25150139da5BE433D15e8e732F',
  '0xa1b79845a7a704D0877C8a4A80072F8ce422104b',
  // Añade más según sea necesario para mainnet
];


const nftContractsTestnet = [
  '0xA4fFd86B9e9E23e091C6af499F43EF9E18CC62fC',
  '0xd28a4A9e6Ea425025a16F60a8b9531968C9cBD09',
  '0xa38860c7F14383904129D5fB3157bFE06FA67980',
];

const nftInfo = {
  '0x2A06B2c0999Af12C251c55D6E2c67330AeAb3C86': {
    title: 'Badge Unlock Summit 2024',
    videoUrl: Unlock2024
  },
  '0xD6C9365273539C7722EAb3BAC3D76dD3b23e6Ff3': {
    title: 'Badge Blackbox 1.2',
    videoUrl: Blackbox12
  },
  '0x8cDff0DF63C816df0d1BbeC7f9e7771915311EDf': {
    title: 'Badge Bosque Real',
    videoUrl: BadgeBosqueReal
  },
  '0x3B70F7347Ed816CDE7A5B25c5AA9BdDE753e3966': {
    title: 'Badge Images Du Futur',
    videoUrl: ImagesDuFuture
  },
  '0x281d59301C137E25150139da5BE433D15e8e732F': {
    title: 'Badge Paris ENO',
    videoUrl: badgeImage
  },
  '0xa1b79845a7a704D0877C8a4A80072F8ce422104b': {
    title: 'Badge Blackbox 1.1',
    videoUrl: badgeBlackbox
  },
};

function MyBadges() {
  const [nfts, setNfts] = useState([]);
  const { currentNetwork, changeNetwork, testnet, error } = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const nftContracts = testnet ? nftContractsTestnet : nftContractsMainnet;

  useEffect(() => {
    if (message) {
      toast({
        title: isConnected ? 'Success' : 'Error',
        description: message,
        status: isConnected ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isConnected, message, toast]);

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

  useEffect(() => {
    if (isConnected && currentNetwork === chain) {
      loadNFTs();
    }
  }, [isConnected, currentNetwork]);

  async function loadNFTs() {
    setIsLoading(true);
    console.log("Loading NFTs...");

    try {
      const validContracts = nftContracts.filter(address => address);
      console.log(`Valid Contracts: ${validContracts}`);

      if (!validContracts.length) {
        console.log("No NFT contracts specified for the current network.");
        return;
      }

      if (isMetaMaskInstalled()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(`Signer Address: ${address}`);
        const nftsTemp = [];

        for (const contractAddress of validContracts) {
          console.log(`Processing Contract: ${contractAddress}`);
          const contract = new ethers.Contract(contractAddress, erc721ABI, provider);

          const balance = await contract.balanceOf(address);
          console.log(`Balance for Contract ${contractAddress}: ${balance.toNumber()}`);

          for (let i = 0; i < balance.toNumber(); i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            const nftData = nftInfo[contractAddress]; // Use predefined information

            nftsTemp.push({
              videoUrl: nftData.videoUrl,
              title: nftData.title, // Use the title
              contractAddress,
              tokenId: tokenId.toString()
            });
          }
        }

        console.log(`Loaded NFTs:`, nftsTemp);
        setNfts(nftsTemp);
      } else {
        toast({
          title: "MetaMask not installed",
          description: "Please install MetaMask to load your NFTs.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error loading NFTs:", error);
      toast({
        title: "Error",
        description: "Error loading NFTs. Please check your connection and try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isMetaMaskInstalled()) {
    return (
      <div className="install-metamask-container">
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

  if (isLoading) {
    return (
      <div className="container">
        <h1 className="hero__title">Loading...</h1>
        <Spinner size="xl" />
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="container">
        <h1 className="hero__title">No Badges Found</h1>
        <p>You don't have any badges yet. Interact with the ENO ecosystem and get your ENO badges.</p>
      </div>
    );
  }

  return (
    <>
      <div className="container2">
        <Flex justifyContent="center" width="100%" alignItems="center">
          <Flex alignItems="center">
            <h2 className="hero__title">My Badges</h2>
            <Link to="/mint-badges">
              <Button colorScheme="teal" size="md" ml="4">
                Mint Badges
              </Button>
            </Link>
          </Flex>
        </Flex>
          
        <div className="nft-grid">
          {nfts.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      </div>
    </>
  );
}

export default MyBadges;
