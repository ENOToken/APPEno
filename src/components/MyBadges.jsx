import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from './NFTCard';
import erc721ABI from '../ABIs/mintBadgeParisABI.json';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useToast, Spinner } from '@chakra-ui/react';

// Listas de direcciones de tus contratos NFT para testnet y mainnet
const nftContractsMainnet = [
  '0xd36f98e23796BC5D24aAf6108BB73c0bED041150',
  // Añade más según sea necesario para mainnet
];

const nftContractsTestnet = [
  '0xA4fFd86B9e9E23e091C6af499F43EF9E18CC62fC',
  '0xd28a4A9e6Ea425025a16F60a8b9531968C9cBD09',
  '0xa38860c7F14383904129D5fB3157bFE06FA67980',
  // Añade más según sea necesario para testnet
];

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

    try {
      // Filtra el array para eliminar cadenas vacías
      const validContracts = nftContracts.filter(address => address);
      // Si el array filtrado está vacío, no hacer nada
      if (!validContracts.length) {
        console.log("No NFT contracts specified for the current network.");
        return;
      }
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const nftsTemp = [];

        for (const contractAddress of nftContracts) {
          const contract = new ethers.Contract(contractAddress, erc721ABI, provider);

          const balance = await contract.balanceOf(address);
          for (let i = 0; i < balance.toNumber(); i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            const tokenURI = await contract.tokenURI(tokenId);
            const response = await fetch(tokenURI);
            const metadata = await response.json();

            nftsTemp.push({
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
              contractAddress,
              tokenId
            });
          }
        }

        setNfts(nftsTemp);
      }
    } catch (error) {
      console.error("Failed to load NFTs:", error);
      toast({
        title: "Error",
        description: "Failed to load NFTs. Please check your connection and try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

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
        <h1 className="hero__title">No Badges Found</h1>
        <p>You don't have any badges yet. Interact with the ENO ecosystem and get your ENO badges.</p>
      </div>
    );
  }

  return (
    <>
        <div className="container2">
            <h1 className="hero__title">My Badges</h1>
            
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
