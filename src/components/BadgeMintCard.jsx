import React from 'react';
import './BadgeMintCard.css';

const BadgeMintCard = ({ badge, badgeData, mintFunction }) => {
  const isFullyMinted = badgeData.totalSupply >= badgeData.maxSupply;

  return (
    <div className="badge-mint-card">
      <video className="nft-preview" autoPlay loop muted playsInline alt={`${badge.title} video`}>
        <source src={badge.videoUrl} type="video/mp4" />
      </video>
      <div className="mint-info">
        <p className='title__badge'>{badge.title}</p>
        <p className='subtitle__badge'>{badgeData.totalSupply} of {badgeData.maxSupply} Minted</p>
        {badge.description && <p className="badge__description">{badge.description}</p>}
      </div>
      <button
        onClick={() => mintFunction(badge.contractAddress)}
        className="hero__btn-mint color-1"
        disabled={isFullyMinted}
      >
        {isFullyMinted ? 'Fully Claimed' : 'Mint'}
      </button>
    </div>
  );
}

export default BadgeMintCard;
