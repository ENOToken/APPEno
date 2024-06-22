import React, { useState, useEffect } from 'react';
import { useToast, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import NFTPurchaseCard from './NFTPurchaseCard';
import badgesNFT from '../assets/badgesNFT.mp4'; // Asegúrate de importar el archivo de video correctamente
import '../App.css';
import './NFTPurchase.css';

const NFTPurchase = () => {
  const toast = useToast();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const response = await fetch('/nftData.json');
        const data = await response.json();
        const nftArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setNfts(nftArray);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
        toast({
          title: 'Error',
          description: 'There was an error loading the NFT data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchNFTData();
  }, [toast]);

  return (
    <div className="container">
      <h2 className="hero__title">Discover our NFT Collection</h2>

      <Link to="/my-nft">
        <Button colorScheme="teal" size="md" ml="4">
          My NFTs
        </Button>
      </Link>

      <div className="nft-grid">
        {nfts.map((nft) => (
          <Link to={`/nft-detail/${nft.id}`} key={nft.contractAddress}>
            <NFTPurchaseCard key={nft.contractAddress} nft={nft} />
          </Link>
        ))}
      </div>

      {/* What Are Eno Badges - Video Section */}
      <section className="EnoBadges">
        <div className="EnoBadges__left">
          <h2 className="hero__title">What are ENO NFTs?</h2>
          <p className="text__subtitle">ENO‘s Badges are NFTs that verify your participation in an activity within our social ecosystem.</p>
          <a href="https://docs.enotoken.io/" target="_blank" rel="noopener noreferrer" className='button__NFT'>
            <button className="hero__btn-alternate color-1">
              Read More in Whitepaper
            </button>
          </a>
        </div>
        <div className="EnoBadges__right">
          <div className='backBadges'>
            <video src={badgesNFT} autoPlay loop muted className='layer'></video>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NFTPurchase;
