import React, { useState, useEffect } from 'react';
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

const ChampagneCarbon = 'https://storage.googleapis.com/intercellar-assets/Champagne-Carbon.mp4';
const CoquerelCalvados = 'https://storage.googleapis.com/intercellar-assets/Coquerel%20fixed.mp4';

const nftContractsMainnet = [
  // '0xE37852873468F1e3793b0BCf984FB564a7Fd57dF',
  // '0xef5e02fE00208153c234b52ad8b2289484B849C1',
];

const nftContractsTestnet = [
  '0x543eaf118C5B2667f70AFf54860262Eb1c199E9c',
  '0x29dEBB128D2CDE5DaC7963D36E3D44667aD88c6c',
];

const nftInfo = {
  '0x543eaf118C5B2667f70AFf54860262Eb1c199E9c': {
    title: 'Champagne Carbon',
    videoUrl: ChampagneCarbon,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
  },
  '0x29dEBB128D2CDE5DaC7963D36E3D44667aD88c6c': {
    title: 'Coquerel Calvados',
    videoUrl: CoquerelCalvados,
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
      await changeNetwork();
      await connectMetaMask();
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
    console.log("Cargando NFTs...");

    try {
      const validContracts = nftContracts.filter(address => address);
      console.log(`Contratos válidos: ${validContracts}`);

      if (!validContracts.length) {
        console.log("No hay contratos NFT especificados para la red actual.");
        return;
      }

      if (isMetaMaskInstalled()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(`Dirección del firmante: ${address}`);
        const nftsTemp = [];

        for (const contractAddress of validContracts) {
          console.log(`Procesando contrato: ${contractAddress}`);
          const contract = new ethers.Contract(contractAddress, erc721ABI, provider);

          const balance = await contract.balanceOf(address);
          console.log(`Balance para el contrato ${contractAddress}: ${balance.toNumber()}`);

          for (let i = 0; i < balance.toNumber(); i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            const nftData = nftInfo[contractAddress];

            nftsTemp.push({
              videoUrl: nftData.videoUrl,
              title: nftData.title,
              description: nftData.description,  
              contractAddress,
              tokenId: tokenId.toString(),
            });
          }
        }

        console.log(`NFTs cargados:`, nftsTemp);
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
      console.error("Error al cargar NFTs:", error);
      toast({
        title: "Error",
        description: "Error al cargar NFTs. Por favor verifica tu conexión e inténtalo de nuevo.",
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
        <h2 className="hero__title">Loading...</h2>
        <Spinner size="xl" />
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="container">
        <h2 className="hero__title">No Badges Found</h2>
        <p>You don't have any badges yet. Interact with the ENO ecosystem and get your ENO badges.</p>
      </div>
    );
  }

  return (
    <>
      <div className="container2">
        <Flex justifyContent="center" width="100%" alignItems="center">
          <Flex alignItems="center">
            <h2 className="hero__title">My NFT's</h2>
            <Link to="/launchpad">
              <Button colorScheme="teal" size="md" ml="4" className='css-70qvj9'>
                Mint Launchpad
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
