import React from 'react';
import './NFTCard.css';

function NFTCard({ nft }) {
  const isVideo = nft.videoUrl.endsWith('.mp4');

  const handleAddToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC721',
            options: {
              address: nft.contractAddress,
              tokenId: nft.tokenId.toString(), // Convertir tokenId a cadena
              image: nft.videoUrl, // Opcional, URL de la imagen
            },
          },
        });

      } catch (error) {
        console.error('Error adding NFT to MetaMask:', error);
        alert(`Failed to add NFT to web3 compatible wallet. Please try manually by adding the contract address: ${nft.contractAddress} and the token ID: ${nft.tokenId}`);
      }
    } else {
      alert('web3 compatible wallet is not installed. Please install it to proceed.');
    }
  };

  return (
    <div className="nft-card" onClick={handleAddToMetaMask}>
      {isVideo ? (
        <video
          src={nft.videoUrl}
          alt={nft.title || "NFT"}
          className="nft-media"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img src={nft.videoUrl} alt={nft.title || "NFT"} className="nft-image" />
      )}
      <div className="nft-info">
        <div className="nft-details">
          {nft.title && <p className="nft-name">{nft.title}</p>}
          {nft.tokenId && <p className="nft-token-id"><strong className='nft-id-individual'>NFT ID: </strong>&nbsp;{nft.tokenId}</p>}
          {nft.description && <p className="nft-description">{nft.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
