//MyBadges.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from './NFTCard';
import erc721ABI from '../ABIs/mintBadgeParisABI.json';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useToast, Spinner, Flex, Button } from '@chakra-ui/react';

import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

import badgeImage from '../assets/badgepariseno.mp4';
import badgeBlackbox from '../assets/BlackBox.mp4';
import ImagesDuFuture from '../assets/ImagesDuFuture.mp4'
import BadgeBosqueReal from '../assets/BadgeBosqueReal.mp4';
import Blackbox12 from '../assets/BadgeBB2_BAJA.mp4';
import Unlock2024 from '../assets/UNLOCK.mp4';

// Listas de direcciones de tus contratos NFT para testnet y mainnet
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
  // Añade más según sea necesario para testnet
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
/*   '0xa38860c7F14383904129D5fB3157bFE06FA67980': { //testnet
    title: 'Badge PBW 2024',
    videoUrl: badgeImage
  }, */



  // Agrega más contratos y su información aquí
};

function MyBadges() {
  const [nfts, setNfts] = useState([]);
  const { changeNetwork, testnet, error } = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Selecciona la lista de contratos según si estás en testnet o mainnet
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
      connectMetaMask(); // Intenta conectar con MetaMask al cargar el componente
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
              videoUrl: nftData.videoUrl, // Usa la URL del video
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
        <h1 className="hero__title">Connect to MetaMask</h1>
        <button onClick={connectMetaMask} className="hero__btn color-1">Connect Wallet</button>
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

  // Verifica si el array de NFTs está vacío y muestra un mensaje en ese caso
  if (nfts.length === 0) {
    return (
      <div className="container">
        <h1 className="hero__title">No NFT Badges Found</h1>
              
        <p>You don't have any badges yet. Interact with the ENO ecosystem and get your ENO badges.</p>
              <Link to="/mint-badges">
                <Button colorScheme="teal" size="md" ml="4">
                  Mint Badges
                </Button>
              </Link>
      </div>
    );
  }

  return (
    <>
        <div className="container2">
          <Flex justifyContent="center" width="100%" alignItems="center">
            <Flex alignItems="center">
              <h1 className="hero__title">My NFT Badges</h1>
              <Link to="/mint-badges">
                <Button colorScheme="teal" size="md" ml="4">
                  Mint NFT Badges
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
