//MyBadges.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from './NFTCard';
import nftAbi from '../ABIs/nftAbi.json';
import erc721ABI from '../ABIs/mintBadgeParisABI.json';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useToast, Spinner, Flex, Button } from '@chakra-ui/react'


import { Link } from 'react-router-dom';

import badgeImage from '../assets/badgepariseno.mp4';
import badgeBlackbox from '../assets/BlackBox.mp4';
import ImagesDuFuture from '../assets/ImagesDuFuture.mp4'
import BadgeBosqueReal from '../assets/BadgeBosqueReal.mp4';

const ChampagneCarbon = 'https://storage.googleapis.com/intercellar-assets/Champagne-Carbon.mp4';
const CoquerelCalvados = 'https://storage.googleapis.com/intercellar-assets/Coquerel%20fixed.mp4'


// Listas de direcciones de tus contratos NFT para testnet y mainnet
const nftContractsMainnet = [
  // '0xE37852873468F1e3793b0BCf984FB564a7Fd57dF',
  // '0xef5e02fE00208153c234b52ad8b2289484B849C1',
];

const nftContractsTestnet = [
  '0xE37852873468F1e3793b0BCf984FB564a7Fd57dF',
  '0xef5e02fE00208153c234b52ad8b2289484B849C1',
];

const nftInfo = {
  '0xE37852873468F1e3793b0BCf984FB564a7Fd57dF': {
    title: 'Champagne Carbon',
    videoUrl: ChampagneCarbon,
  },

  '0xef5e02fE00208153c234b52ad8b2289484B849C1': {
    title: 'Coquerel Calvados',
    videoUrl: CoquerelCalvados,
  },
};

function MyBadges() {
  const [nfts, setNfts] = useState([]);
  const { changeNetwork, testnet, error } = useNetworkSwitcher();
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
        title: 'Network Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);


  useEffect(() => {
    if (window.ethereum) {
      connectMetaMask(); 
    }
  }, [connectMetaMask]);

  useEffect(() => {
    changeNetwork();
    console.log(testnet ? "Estamos en testnet" : "Estamos en mainnet");
  }, [changeNetwork, testnet]);

  useEffect(() => {
    if (!isConnected) {
      connectMetaMask();
    } else {
      loadNFTs();
    }
  }, [isConnected, connectMetaMask]);

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

      if (window.ethereum) {
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
            const nftData = nftInfo[contractAddress]; // Usa la información predefinida

            nftsTemp.push({
              videoUrl: nftData.videoUrl,
              title: nftData.title, // Usa el título
              contractAddress,
              tokenId: tokenId.toString()
            });
          }
        }

        console.log(`NFTs cargados:`, nftsTemp);
        setNfts(nftsTemp);
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

  if (!isConnected) {
    return (
      <div className="container">
        <h2 className="hero__title">Connect to MetaMask</h2>
        <button onClick={connectMetaMask} className="hero__btn color-1">Connect Wallet</button>
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

  // Verifica si el array de NFTs está vacío y muestra un mensaje en ese caso
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
            <Link to="/mint-badges">
              <Button colorScheme="teal" size="md" ml="4">
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
