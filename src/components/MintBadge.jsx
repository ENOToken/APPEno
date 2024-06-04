import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';
import contractABI from '../ABIs/mintBadgeParisABI.json';
import useNetworkSwitcher from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useToast, Button, Flex } from '@chakra-ui/react';
import BadgeMintCard from './BadgeMintCard';
import { Link } from 'react-router-dom';

// imágenes
import badgeImage from '../assets/badgepariseno.mp4';
import badgeBlackbox from '../assets/BlackBox.mp4';
import ImagesDuFuture from '../assets/ImagesDuFuture.mp4';
import BadgeBosqueReal from '../assets/BadgeBosqueReal.mp4';
import Blackbox12 from '../assets/BadgeBB2_BAJA.mp4';
import Unlock2024 from '../assets/UNLOCK.mp4';

function MintBadge() {
  const { changeNetwork, testnet, error } = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector();
  const toast = useToast();

  const badgesMainnet = [
    {
      title: "Badge Unlock Summit 2024",
      videoUrl: Unlock2024,
      contractAddress: "0x2A06B2c0999Af12C251c55D6E2c67330AeAb3C86",
    },
    {
      title: "Badge Blackbox 1.2",
      videoUrl: Blackbox12,
      contractAddress: "0xD6C9365273539C7722EAb3BAC3D76dD3b23e6Ff3",
    },
    {
      title: "Badge Bosque Real",
      videoUrl: BadgeBosqueReal,
      contractAddress: "0x8cDff0DF63C816df0d1BbeC7f9e7771915311EDf",
    },
    {
      title: "Badge Images Du Futur",
      videoUrl: ImagesDuFuture,
      contractAddress: "0x3B70F7347Ed816CDE7A5B25c5AA9BdDE753e3966",
    },
    {
      title: "Badge Paris ENO",
      videoUrl: badgeImage,
      contractAddress: "0x281d59301C137E25150139da5BE433D15e8e732F",
    },
    {
      title: "Badge Blackbox 1.1",
      videoUrl: badgeBlackbox,
      contractAddress: "0xa1b79845a7a704D0877C8a4A80072F8ce422104b",
    },
  ];

  const badgesTestnet = [
    {
      title: "Testnet Badge 1",
      videoUrl: badgeImage,
      contractAddress: "0xa38860c7F14383904129D5fB3157bFE06FA67980",
    },
  ];

  const badgesToMint = testnet ? badgesTestnet : badgesMainnet;
  const badgesRef = useRef(badgesToMint); // Use a ref to store badgesToMint

  const [badgeData, setBadgeData] = useState({});

  useEffect(() => {
    const fetchBadgeData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const data = {};
      for (const badge of badgesRef.current) {
        try {
          const contract = new ethers.Contract(badge.contractAddress, contractABI, provider);
          const tokenId = await contract._tokenId();
          const maxSupply = await contract.MAX_SUPPLY();
          console.log(`Badge: ${badge.title}, tokenId: ${tokenId}, maxSupply: ${maxSupply}`);
          data[badge.contractAddress] = {
            totalSupply: tokenId.toNumber() - 1,
            maxSupply: maxSupply.toNumber(),
          };
        } catch (error) {
          console.error(`Error fetching data for badge ${badge.title}:`, error);
        }
      }
      setBadgeData(data);
    };

    fetchBadgeData(); // Fetch immediately on mount
    const interval = setInterval(fetchBadgeData, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []); // Only run once on mount

  const mintNFT = useCallback(async (contractAddress) => {
    if (!isConnected) {
      connectMetaMask();
    } else {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
        const transaction = await nftContract.mint(await signer.getAddress());
        await transaction.wait();
        toast({
          title: 'Mint successful!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        let errorMessage = 'Minting failed. Please try again.';
        if (error.code === 4001) {
          errorMessage = 'Transaction rejected by user. Please approve the transaction to mint your NFT.';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Not enough ETH for gas fees. Please ensure your wallet has sufficient funds.';
        } else if (error.message.includes('Each address may only mint one NFT')) {
          errorMessage = 'You have already minted 1 Badge. Please check in the "My Badges" tab.';
        }
        toast({
          title: 'Minting Error',
          description: errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [isConnected, connectMetaMask, toast]);

  return (
    <div className="container">
      <Flex justifyContent="center" width="100%" alignItems="center">
        <Flex alignItems="center">
          <h1 className="hero__title">Mint NFT Badges</h1>
          <Link to="/my-badges">
            <Button colorScheme="teal" size="md" ml="4">
              My NFT Badges
            </Button>
          </Link>
        </Flex>
      </Flex>

      <div className="nft-grid">
        {badgesToMint.map(badge => (
          <BadgeMintCard
            key={badge.contractAddress}
            badge={badge}
            badgeData={badgeData[badge.contractAddress] || { totalSupply: 0, maxSupply: 0 }}
            mintFunction={mintNFT}
          />
        ))}
      </div>
    </div>
  );
}

export default MintBadge;
