import React, { useCallback, useEffect } from 'react';
import { ethers } from 'ethers'; // Esta es la importación correcta
import contractABI from '../ABIs/mintBadgeParisABI.json';
import badgeVideo from '../assets/badgepariseno.webm';
import badgeFallback from '../assets/badgepariseno.png';

const contractAddress = "0xE6cA5D7370567728DCac1a3C1B7644E8A7Cba740";

function MintBadge() {
  const changeNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }], // Chain ID de Arbitrum. Asegúrate de que este sea el chainId correcto
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          // Intenta agregar la red (esto es opcional y depende de tu caso de uso)
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ /* Parámetros de la red */ }], // Deberías especificar los parámetros de la red aquí
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(switchError);
    }
  }, []);

  useEffect(() => {
    changeNetwork(); // Verifica y cambia la red cuando el componente se monta
  }, [changeNetwork]);

  const mintNFT = useCallback(async () => {
    if (window.ethereum) {
      try {
        await changeNetwork();

        await window.ethereum.request({ method: 'eth_requestAccounts' });
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
    } else {
      alert('Ethereum wallet is not detected. Please install MetaMask or another Ethereum wallet.');
    }
  }, []);

  return (
    <div className="container">
      <h1 className="hero__title">ENO PBW 2024</h1>
      <video className="nft-preview" autoPlay loop muted playsInline>
        <source src={badgeVideo} type="video/webm" />
        <img src={badgeFallback} alt="NFT Preview" />
      </video>
      <button id="mintButton" className="hero__btn color-1" onClick={mintNFT}>Mint</button>
    </div>

  );
}

export default MintBadge;