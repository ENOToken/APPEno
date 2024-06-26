import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';
import contractABI from '../ABIs/mintBadgeParisABI.json';
import { useNetworkSwitcher, chain } from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useToast, Button, Flex } from '@chakra-ui/react';
import BadgeMintCard from './BadgeMintCard';
import { Link } from 'react-router-dom';
import './MintBadge.css';

// Imágenes
import badgeImage from '../assets/badgepariseno.mp4';
import badgeBlackbox from '../assets/BlackBox.mp4';
import ImagesDuFuture from '../assets/ImagesDuFuture.mp4';
import BadgeBosqueReal from '../assets/BadgeBosqueReal.mp4';
import Blackbox12 from '../assets/BadgeBB2_BAJA.mp4';
import Unlock2024 from '../assets/UNLOCK.mp4';
import badgesNFT from '../assets/badgesNFT.mp4';

function MintBadge() {
  const { currentNetwork, changeNetwork, testnet, error } = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector();
  const toast = useToast();

  const badgesMainnet = [
    {
      title: "Unlock Summit 2024",
      videoUrl: Unlock2024,
      contractAddress: "0x2A06B2c0999Af12C251c55D6E2c67330AeAb3C86",
      description: "This badge celebrates our participation in the Unlock Summit 2024, an event that brought together leaders and visionaries to shape the future of web 3.0 technology.",
    },
    {
      title: "Blackbox 1.2",
      videoUrl: Blackbox12,
      contractAddress: "0xD6C9365273539C7722EAb3BAC3D76dD3b23e6Ff3",
      description: "This is the commemorative badge of Blackbox 1.2, designed to extend the experience of the Unlock Summit and promote networking in a relaxed environment.",
    },
    {
      title: "Bosque Real",
      videoUrl: BadgeBosqueReal,
      contractAddress: "0x8cDff0DF63C816df0d1BbeC7f9e7771915311EDf",
      description: "This badge symbolizes the innovative partnership between ENO and Bosque Real, a milestone in the Mexican real estate market.",
    },
    {
      title: "Images Du Futur",
      videoUrl: ImagesDuFuture,
      contractAddress: "0x3B70F7347Ed816CDE7A5B25c5AA9BdDE753e3966",
      description: "This badge certifies your participation in Images Du Futur, an artistic exploration where technology and art intertwine to foresee the future.",
    },
    {
      title: "Paris ENO",
      videoUrl: badgeImage,
      contractAddress: "0x281d59301C137E25150139da5BE433D15e8e732F",
      description: "This badge commemorates our attendance at Paris Blockchain Week and symbolizes our commitment to technological revolutions in the blockchain field.",
    },
    {
      title: "Blackbox 1.1",
      videoUrl: badgeBlackbox,
      contractAddress: "0xa1b79845a7a704D0877C8a4A80072F8ce422104b",
      description: "This badge is historic as it was the first badge awarded within the ENO ecosystem.",
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
  const badgesRef = useRef(badgesToMint);

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

  const handleConnect = async () => {
    try {
      await connectMetaMask();
      await changeNetwork();
    } catch (error) {
      console.error('Failed to connect MetaMask and switch network:', error);
    }
  };

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

  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined'
  };

  if (!isMetaMaskInstalled()) {
    return (
      <div className="install-metamask-container">
        <Button as="a" href="https://metamask.io/download.html" target="_blank" colorScheme="teal" size="lg">
          Install Wallet
        </Button>
        <p className="install-message">Please install a web3 compatible wallet to proceed.</p>
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

  return (
    <div className="container">
      <Flex justifyContent="center" width="100%" alignItems="center">
        <Flex alignItems="center">
          <div className='container__mint'>
            <h2 className="hero__title">Mint Your NFT Badges</h2>
            <Link to="/my-badges">
              <Button colorScheme="teal" size="md" ml="4">
                My NFT Badges
              </Button>
            </Link>
          </div>
        </Flex>
      </Flex>

      <div className="nft-grid-list">
        {badgesToMint.map(badge => (
          <BadgeMintCard
            key={badge.contractAddress}
            badge={badge}
            badgeData={badgeData[badge.contractAddress] || { totalSupply: 0, maxSupply: 0 }}
            mintFunction={mintNFT}
            className="grid-items"
          />
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
}

export default MintBadge;
