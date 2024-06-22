import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Flex, Button } from '@chakra-ui/react';
import NFTPurchaseCard from './NFTPurchaseCard';

const NFTPurchaseDetails = () => {
  const { contractAddress } = useParams();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const response = await fetch('/nftData.json');
        const data = await response.json();
        const foundNft = Object.keys(data).map(key => ({ id: key, ...data[key] })).find(n => n.contractAddress === contractAddress);
        setNft(foundNft);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      }
    };

    fetchNFTData();
  }, [contractAddress]);

  if (!nft) {
    return <p>Loading...</p>; // o cualquier otro indicador de carga
  }

  return (
    <div>
      <Flex justifyContent="center" width="100%" alignItems="center">
        <Flex alignItems="center">
          <h2 className="hero__title">{nft.title}</h2>
          <Link to="/launchpad">
            <Button colorScheme="teal" size="md" ml="4">
              Launchpad
            </Button>
          </Link>
        </Flex>
      </Flex>
      <NFTPurchaseCard nft={nft} />
    </div>
  );
};

export default NFTPurchaseDetails;
