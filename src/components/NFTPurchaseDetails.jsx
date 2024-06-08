//NFTPurchaseDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Flex, Button } from '@chakra-ui/react';
import NFTPurchaseCard from './NFTPurchaseCard';
import { initialNFTs } from './NFTPurchase'; // Asegúrate de exportar initialNFTs en NFTPurchase.jsx

const NFTPurchaseDetails = () => {
  const { contractAddress } = useParams();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    // Encuentra el NFT basado en contractAddress
    const foundNft = initialNFTs.find(n => n.contractAddress === contractAddress);
    setNft(foundNft);
  }, [contractAddress]);

  if (!nft) {
    return <p>Loading...</p>; // o cualquier otro indicador de carga
  }

  return (
    <div>
        <Flex justifyContent="center" width="100%" alignItems="center">
        <Flex alignItems="center">
            <h1 className="hero__title">{nft.title}</h1>
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
