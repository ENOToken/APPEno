import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Flex, Button } from '@chakra-ui/react';
import NFTPurchaseCard from './NFTPurchaseCard';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher'; // Importa el hook
import { testnetNFTs, mainnetNFTs } from './NFTPurchase'; // Importa las listas de NFTs

const NFTPurchaseDetails = () => {
  const { contractAddress } = useParams();
  const [nft, setNft] = useState(null);
  const { testnet } = useNetworkSwitcher(); // Usa el hook para obtener el estado de testnet

  useEffect(() => {
    // Selecciona la lista correcta de NFTs basada en el valor de testnet
    const nfts = testnet ? testnetNFTs : mainnetNFTs;
    // Encuentra el NFT basado en contractAddress
    const foundNft = nfts.find(n => n.contractAddress === contractAddress);
    setNft(foundNft);
  }, [contractAddress, testnet]);

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
