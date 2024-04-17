import React from 'react';

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
          controls
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
        {nft.title && <h5 className="nft-name">{nft.title}</h5>}
      </div>
    </div>
  );
}

export default NFTCard;
