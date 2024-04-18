import React from 'react';

function BadgeMintCard({ badge, mintFunction }) {
  return (
    <div className="badge-mint-card">
      <video className="nft-preview" autoPlay loop muted playsInline>
        <source src={badge.videoUrl} type="video/mp4" />
      </video>
      <button onClick={() => mintFunction(badge.contractAddress)} className="hero__btn color-1">
        Mint
      </button>
    </div>
  );
}

export default BadgeMintCard;
