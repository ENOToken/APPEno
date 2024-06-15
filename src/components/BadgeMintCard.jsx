import React from 'react';

function BadgeMintCard({ badge, badgeData, mintFunction }) {
  const isFullyMinted = badgeData.totalSupply >= badgeData.maxSupply;

  return (
    <div className="badge-mint-card">
      <video className="nft-preview" autoPlay loop muted playsInline>
        <source src={badge.videoUrl} type="video/mp4" />
      </video>
      <div className="mint-info">
        <p><span>{badgeData.totalSupply}</span> / {badgeData.maxSupply} minted</p>
      </div>
      <button
        onClick={() => mintFunction(badge.contractAddress)}
        className="hero__btn color-1"
        disabled={isFullyMinted}
      >
        {isFullyMinted ? 'Fully Claimed' : 'Mint'}
      </button>
    </div>
  );
}

export default BadgeMintCard;
