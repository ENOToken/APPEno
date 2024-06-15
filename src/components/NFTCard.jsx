// NFTCard.jsx
import React from 'react';
import './NFTCard.css'

function NFTCard({ nft }) {
  // Decide si el contenido es un video basándose en la URL (por ejemplo, si termina en .mp4)
  const isVideo = nft.videoUrl.endsWith('.mp4');

  return (
    <div className="nft-card">
      {isVideo ? (
        // Se utiliza un elemento <video> para reproducir el archivo MP4.
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
        // Este caso para imágenes queda como fallback, pero según tu nueva especificación quizás no sea necesario.
        <img src={nft.videoUrl} alt={nft.title || "NFT"} className="nft-image" />
      )}
      <div className="nft-info">
        </div>
        {nft.title && <h5 className="nft-name">{nft.title}</h5>}
        {nft.tokenId && <p className="nft-token-id">Token ID: {nft.tokenId}</p>}
    </div>
  );
}

export default NFTCard;
