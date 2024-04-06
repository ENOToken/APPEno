import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from './NFTCard';
import erc721ABI from '../ABIs/mintBadgeParisABI.json';

// Lista de direcciones de tus contratos NFT
const nftContracts = [
  '0xd36f98e23796BC5D24aAf6108BB73c0bED041150',
  // Añade más según sea necesario
];

function MyBadges() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const loadNFTs = async () => {
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
    };

    loadNFTs();
  }, []);

  return (
    <>
        <div className="container">
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
