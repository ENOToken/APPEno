import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import NFTCard from './NFTCard';
import erc721ABI from '../ABIs/mintBadgeParisABI.json';
import { useNetworkSwitcher, chain } from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useToast, Spinner, Flex, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import './MyBadges.css';

import badgeImage from '../assets/badgepariseno.mp4';
import badgeBlackbox from '../assets/BlackBox.mp4';
import ImagesDuFuture from '../assets/ImagesDuFuture.mp4';
import BadgeBosqueReal from '../assets/BadgeBosqueReal.mp4';
import Blackbox12 from '../assets/BadgeBB2_BAJA.mp4';
import Unlock2024 from '../assets/UNLOCK.mp4';

import badgesNFT from '../assets/badgesNFT.mp4';

const nftContractsMainnet = [
  '0x2A06B2c0999Af12C251c55D6E2c67330AeAb3C86',
  '0xD6C9365273539C7722EAb3BAC3D76dD3b23e6Ff3',
  '0x8cDff0DF63C816df0d1BbeC7f9e7771915311EDf',
  '0x3B70F7347Ed816CDE7A5B25c5AA9BdDE753e3966',
  '0x281d59301C137E25150139da5BE433D15e8e732F',
  '0xa1b79845a7a704D0877C8a4A80072F8ce422104b',
];

const nftContractsTestnet = [
  '0xA4fFd86B9e9E23e091C6af499F43EF9E18CC62fC',
  '0xd28a4A9e6Ea425025a16F60a8b9531968C9cBD09',
  '0xa38860c7F14383904129D5fB3157bFE06FA67980',
];

const nftInfo = {
  '0x2A06B2c0999Af12C251c55D6E2c67330AeAb3C86': {
    title: 'Badge Unlock Summit 2024',
    videoUrl: Unlock2024,
  },
  '0xD6C9365273539C7722EAb3BAC3D76dD3b23e6Ff3': {
    title: 'Badge Blackbox 1.2',
    videoUrl: Blackbox12,
  },
  '0x8cDff0DF63C816df0d1BbeC7f9e7771915311EDf': {
    title: 'Badge Bosque Real',
    videoUrl: BadgeBosqueReal,
  },
  '0x3B70F7347Ed816CDE7A5B25c5AA9BdDE753e3966': {
    title: 'Badge Images Du Futur',
    videoUrl: ImagesDuFuture,
  },
  '0x281d59301C137E25150139da5BE433D15e8e732F': {
    title: 'Badge Paris ENO',
    videoUrl: badgeImage,
  },
  '0xa1b79845a7a704D0877C8a4A80072F8ce422104b': {
    title: 'Badge Blackbox 1.1',
    videoUrl: badgeBlackbox,
  },
};

const MyBadges = () => {
  const { currentNetwork, changeNetwork, testnet, error } = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector();
  const toast = useToast();
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNFTs = useCallback(async () => {
    if (!isConnected || currentNetwork !== chain) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const nftContracts = currentNetwork === testnet ? nftContractsTestnet : nftContractsMainnet;

    const nftPromises = nftContracts.map(async (contractAddress) => {
      const contract = new ethers.Contract(contractAddress, erc721ABI, signer);
      const balance = await contract.balanceOf(await signer.getAddress());
      const nftTokenIds = [];

      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(await signer.getAddress(), i);
        nftTokenIds.push(tokenId.toNumber());
      }

      return nftTokenIds.map((tokenId) => ({
        contractAddress,
        tokenId,
        ...nftInfo[contractAddress],
      }));
    });

    const nftResults = await Promise.all(nftPromises);
    setNfts(nftResults.flat());
    setIsLoading(false);
  }, [isConnected, currentNetwork]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  const renderConnectMessage = () => {
    if (!isConnected && currentNetwork !== chain) {
      return 'Please connect your wallet and switch to the correct network.';
    } else if (!isConnected) {
      return 'Please connect your wallet.';
    } else if (currentNetwork !== chain) {
      return 'Please switch to the correct network.';
    }
    return '';
  };

  const renderConnectButtonLabel = () => {
    if (!isConnected) {
      return 'Connect Wallet';
    } else if (currentNetwork !== chain) {
      return 'Change Network';
    }
    return '';
  };

  const handleConnect = async () => {
    if (!isConnected) {
      await connectMetaMask();
    } else if (currentNetwork !== chain) {
      await changeNetwork();
    }
  };

  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };

  if (!isMetaMaskInstalled()) {
    return (
      <div className="install-metamask-container">
        <Button as="a" href="https://metamask.io/download.html" target="_blank" colorScheme="teal" size="lg">
          Install MetaMask
        </Button>
        <p className="install-message">Please install MetaMask to proceed.</p>
      </div>
    );
  }

  if (!isConnected || currentNetwork !== chain) {
    return (
      <div className="connect-container">
        <Button onClick={handleConnect} colorScheme="teal" size="lg">
          {renderConnectButtonLabel()}
        </Button>
        <p className="connect-message">{renderConnectMessage()}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <h1 className="hero__title">Loading...</h1>
        <Spinner size="xl" />
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="container">
        <h1 className="hero__title">No Badges Found</h1>
        <p>You don't have any badges yet. Interact with the ENO ecosystem and get your ENO badges.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Flex justifyContent="center" width="100%" alignItems="center">
        <Flex alignItems="center">
          <h2 className="hero__title">My NFT Badges</h2>
          <Link to="/mint-badges">
            <Button colorScheme="teal" size="md" ml="4">
              Mint NFT Badges
            </Button>
          </Link>
        </Flex>
      </Flex>

      <div className="nft-grid-list">
        {nfts.map((nft, index) => (
          <NFTCard key={index} nft={nft} />
        ))}
      </div>

      {/* ======= What Are Eno Badges - Video ======= */}
      <section className="EnoBadges">
        <div className="EnoBadges__left">
          <h2 className="hero__title">What are ENO Badges?</h2>
          <p className="text__subtitle">ENO‘s Badges are NFTs that verify your participation in an activity within our social ecosystem.</p>
          <a href="https://docs.enotoken.io/eno-digital-assets/nft-badges" target="_blank" rel="noopener noreferrer" className='button__NFT'>
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

export default MyBadges;
