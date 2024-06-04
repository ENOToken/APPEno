//NFTPurchase.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher';
import { Link } from 'react-router-dom';
import NFTPurchaseCard from './NFTPurchaseCard';

//imagenes
const BadgeBosqueReal = 'https://storage.googleapis.com/intercellar-assets/Champagne-Carbon.mp4';
const ImagesDuFuture = 'https://storage.googleapis.com/intercellar-assets/Coquerel%20fixed.mp4'

const usdtContractAddress = "0x0997ff490B1cA814C55eB0854A0969431fCDaa1e";

// Lista de NFTs para testnet
export const testnetNFTs = [
  {
    title: "Champagne Carbon",
    image: BadgeBosqueReal,
    contractAddress: "0xE37852873468F1e3793b0BCf984FB564a7Fd57dF",
    usdtContractAddress: usdtContractAddress
  },
  {
    title: "Coquerel Calvados",
    image: ImagesDuFuture,
    contractAddress: "0xef5e02fE00208153c234b52ad8b2289484B849C1",
    usdtContractAddress: usdtContractAddress
  },
  // Añade más NFTs aquí según sea necesario
];

// Lista de NFTs para mainnet
export const mainnetNFTs = [

  // Añade más NFTs aquí según sea necesario
];

const NFTPurchase = () => {
  const { isConnected, connectMetaMask } = useMetaMaskConnector();
  const { testnet } = useNetworkSwitcher(); // Usa el hook para obtener el estado de testnet
  const toast = useToast();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (!isConnected) {
      connectMetaMask();
    }
  }, [isConnected, connectMetaMask]);


  useEffect(() => {
    if (testnet) {
      setNfts(testnetNFTs); // Carga los NFTs de testnet si testnet es true
    } else {
      setNfts(mainnetNFTs); // Carga los NFTs de mainnet si testnet es false
    }
  }, [testnet]);

  return (
    <div className="container">
      <h1 className="hero__title">Launchpad</h1>
      <div className="nft-grid">
        {nfts.map((nft) => (
          <Link to={`/nft/${nft.contractAddress}`} key={nft.contractAddress}>
            <NFTPurchaseCard key={nft.contractAddress} nft={nft} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NFTPurchase;
