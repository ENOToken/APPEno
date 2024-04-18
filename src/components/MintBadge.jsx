import React, { useCallback, useEffect } from 'react';
import { ethers } from 'ethers'; // Esta es la importación correcta
import contractABI from '../ABIs/mintBadgeParisABI.json';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector'; // Asegúrate de importar tu hook
import { useToast } from '@chakra-ui/react';
import BadgeMintCard from './BadgeMintCard';
import badgeImage from '../assets/badgepariseno.mp4';
import badgeBlackbox from '../assets/BlackBox.mp4';
import ImagesDuFuture from '../assets/ImagesDuFuture.mp4';
import BadgeBosqueReal from '../assets/BadgeBosqueReal.mp4';

function MintBadge() {
 
  const { changeNetwork, testnet , error} = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector(); // Usamos la función del hook
  const toast = useToast();

  // Listas de badges para testnet y mainnet
  const badgesMainnet = [
    {
      title: "Badge Paris ENO",
      videoUrl: badgeImage,
      contractAddress: "0xAe737D827cE3997822169A18CC761F2f60BEC9Ac",
    },
    {
      title: "Badge Images Du Futur",
      videoUrl: ImagesDuFuture,
      contractAddress: "0x0A5CEB58E8A6C5a03cD41A2eaa7498B18092450a",
    },
    {
      title: "Badge Bosque Real",
      videoUrl: BadgeBosqueReal,
      contractAddress: "0x7F4622Ba8574d061649aCA13F639713D7c42d7Ea",
    },
    // Agrega más badges según sea necesario para mainnet
  ];

  const badgesTestnet = [
    {
      title: "Testnet Badge 1",
      videoUrl: badgeImage,
      contractAddress: "0xa38860c7F14383904129D5fB3157bFE06FA67980",
    },
    {
      title: "Testnet Badge 2",
      videoUrl: badgeBlackbox,
      contractAddress: "0xa38860c7F14383904129D5fB3157bFE06FA67980",
    },
    // Agrega más badges según sea necesario para testnet
  ];

/*   let contractAddress = "0xa38860c7F14383904129D5fB3157bFE06FA67980"; // Testnet

  if (!testnet){
    contractAddress = "0xAe737D827cE3997822169A18CC761F2f60BEC9Ac"; // Mainnet 
  } */

  const badgesToMint = testnet ? badgesTestnet : badgesMainnet;

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
    if (!isConnected) {
      connectMetaMask();
    }
    changeNetwork();
  }, [isConnected, connectMetaMask, changeNetwork]);

  const mintNFT = useCallback(async (contractAddress) => {
    if (!isConnected) {
      connectMetaMask();
    } else {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
        const transaction = await nftContract.mint(await signer.getAddress());
        await transaction.wait();
        toast({
          title: 'Mint successful!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        let errorMessage = 'Minting failed. Please try again.';
        if (error.code === 4001) { // Código común para "acción rechazada por el usuario" en MetaMask y posiblemente otros proveedores
          errorMessage = 'Transaction rejected by user. Please approve the transaction to mint your NFT.';
        } else if (error.message.includes('insufficient funds')) { // Ajusta esta cadena de error según lo que observes en la práctica
          errorMessage = 'Not enough ETH for gas fees. Please ensure your wallet has sufficient funds.';
        } else if (error.message.includes('Each address may only mint one NFT')) {
          errorMessage = 'You have already minted 1 Badge. Please check in the "My Badges" tab.';
        }
        toast({
          title: 'Minting Error',
          description: errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [isConnected, connectMetaMask, toast]);
  

  return (
    <div className="container">
      <h1 className="hero__title">Mint Your Badges</h1>
      <div className="nft-grid">
        {badgesToMint.map(badge => (
          <BadgeMintCard key={badge.contractAddress} badge={badge} mintFunction={mintNFT} />
        ))}
      </div>
    </div>
  );
}

export default MintBadge;