import React, { useCallback, useEffect } from 'react';
import { ethers } from 'ethers'; // Esta es la importación correcta
import contractABI from '../ABIs/mintBadgeParisABI.json';
import badgeVideo from '../assets/badgepariseno.webm';
import badgeFallback from '../assets/badgepariseno.png';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector'; // Asegúrate de importar tu hook

const contractAddress = "0xE6cA5D7370567728DCac1a3C1B7644E8A7Cba740";

function MintBadge() {
 
  const changeNetwork = useNetworkSwitcher();
  const { isConnected, connectMetaMask } = useMetaMaskConnector(); // Usamos la función del hook

  useEffect(() => {
    if (!isConnected) {
      connectMetaMask();
    }
    changeNetwork();
  }, [isConnected, connectMetaMask, changeNetwork]);

  const mintNFT = useCallback(async () => {
    if (!isConnected) {
      // Si no está conectado, intentamos conectar
      connectMetaMask();
    } else {
      // Aquí va la lógica de minteo si el usuario está conectado
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
        const transaction = await nftContract.mint(await signer.getAddress());
        await transaction.wait();
        alert('Mint successful!');
      } catch (error) {
        console.error(error);
        alert('Mint failed: ' + error.message);
      }
    }
  }, [isConnected, connectMetaMask]);

  return (
    <div className="container">
      <h1 className="hero__title">ENO PBW 2024</h1>
      <video className="nft-preview" autoPlay loop muted playsInline>
        <source src={badgeVideo} type="video/webm" />
        <img src={badgeFallback} alt="NFT Preview" />
      </video>
      <button 
        id="mintButton" 
        className="hero__btn color-1" 
        onClick={mintNFT}>
        {isConnected ? 'Mint' : 'Connect to MetaMask'}
      </button>
    </div>

  );
}

export default MintBadge;