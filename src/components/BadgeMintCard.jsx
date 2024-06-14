//BadgeMintCard.jsx
import React from 'react';
import './BadgeMintCard.css';

function BadgeMintCard({ badge, mintFunction }) {
  return (
    <div className="badge-mint-card">
      <video className="nft-preview" autoPlay loop muted playsInline>
        <source src={badge.videoUrl} type="video/mp4" />
      </video>
      <button onClick={() => mintFunction(badge.contractAddress)} className="hero__btn-mint color-1">
        Mint
      </button>
    </div>
  );
}

export default BadgeMintCard;
