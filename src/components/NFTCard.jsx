import React, { useState } from 'react';

function NFTMedia({ src }) {
  const [isVideo, setIsVideo] = useState(true);

  const handleVideoError = () => {
    // Si hay un error cargando el video, cambia a imagen
    setIsVideo(false);
  };

  return (
    isVideo ? (
      <video className="nft-media" loop autoPlay muted playsInline onError={handleVideoError}>
        <source src={src} type="video/mp4" />
      </video>
    ) : (
      <img src={src} alt="NFT" className="nft-image" />
    )
  );
}

function NFTCard({ nft }) {
  return (
    <div className="nft-card">
      <NFTMedia src={nft.image} />
      <div className="nft-info">
        <h5 className="nft-name">{nft.name}</h5>
        <p className="nft-description">{nft.description}</p>
      </div>
    </div>
  );
}

export default NFTCard;
