import React from 'react';
import './NFTCard.css';

function NFTCard({ nft }) {
  const isVideo = nft.videoUrl.endsWith('.mp4');

  return (
    <div className="nft-card">
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
