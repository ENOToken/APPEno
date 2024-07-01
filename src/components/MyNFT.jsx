import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from './NFTCard';
import erc721ABI from '../ABIs/mintBadgeParisABI.json';
import { useNetworkSwitcher, chain } from '../hooks/useNetworkSwitcher';
import useMetaMaskConnector from '../hooks/useMetaMaskConnector';
import { useToast, Spinner, Flex, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import './MyNFT.css';

function MyNFTs() {
  const [nfts, setNfts] = useState([]);
  const [nftContracts, setNftContracts] = useState([]);
  const [nftInfo, setNftInfo] = useState({});
  const { currentNetwork, changeNetwork, testnet, error } = useNetworkSwitcher();
  const { isConnected, connectMetaMask, message } = useMetaMaskConnector();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/nftData.json')
      .then(response => response.json())
      .then(data => {
        const contracts = Object.values(data).map(nft => nft.contractAddress);
        setNftContracts(testnet ? contracts : contracts);
        setNftInfo(data);
      })
      .catch(error => console.error('Error fetching NFT data:', error));
  }, [testnet]);

  useEffect(() => {
    if (message) {
      toast({
        title: isConnected ? 'Success' : 'Error',
        description: message,
        status: isConnected ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isConnected, message, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'INFO',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleConnect = async () => {
    try {
      await changeNetwork();
      await connectMetaMask();
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
    return typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined';
  };

  useEffect(() => {
    if (isConnected && currentNetwork === chain) {
      loadNFTs();
    }
  }, [isConnected, currentNetwork, nftContracts, nftInfo]);

  async function loadNFTs() {
    setIsLoading(true);
    console.log("Cargando NFTs...");

    try {
      const validContracts = nftContracts.filter(address => address);
      console.log(`Contratos válidos: ${validContracts}`);

      if (!validContracts.length) {
        console.log("No hay contratos NFT especificados para la red actual.");
        return;
      }

      if (isMetaMaskInstalled()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(`Dirección del firmante: ${address}`);
        const nftsTemp = [];

        for (const contractAddress of validContracts) {
          console.log(`Procesando contrato: ${contractAddress}`);
          const contract = new ethers.Contract(contractAddress, erc721ABI, provider);

          const balance = await contract.balanceOf(address);
          console.log(`Balance para el contrato ${contractAddress}: ${balance.toNumber()}`);

          for (let i = 0; i < balance.toNumber(); i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            const nftData = Object.values(nftInfo).find(info => info.contractAddress === contractAddress);

            if (nftData) {
              nftsTemp.push({
                videoUrl: nftData.video,
                title: nftData.title,
                description: nftData.descriptionShort,
                contractAddress,
                tokenId: tokenId.toString(),
              });
            }
          }
        }

        console.log(`NFTs cargados:`, nftsTemp);
        setNfts(nftsTemp);
      } else {
        toast({
          title: "web3 compatible wallet not installed",
          description: "Please install web3 compatible wallet to load your NFTs.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al cargar NFTs:", error);
      toast({
        title: "Error",
        description: "Error al cargar NFTs. Por favor verifica tu conexión e inténtalo de nuevo.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isMetaMaskInstalled()) {
    return (
      <div className="install-metamask-container">
        <Button as="a" href="https://metamask.io/download.html" target="_blank" colorScheme="teal" size="lg">
          Install Wallet
        </Button>
        <p className="install-message">Please install web3 compatible wallet to proceed.</p>
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
        <h2 className="hero__title">Loading...</h2>
        <Spinner size="xl" />
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="container">
        <h2 className="hero__title">No NFTs Found</h2>
        <p>You don't have any NFT yet. Interact with the ENO ecosystem and get your ENO NFTs.</p>
      </div>
    );
  }

  return (
    <>
      <div className="containerNFT">
        <Flex justifyContent="center" width="100%" alignItems="center">
          <Flex alignItems="center">
            <h2 className="hero__title">My NFTs</h2>
            <Link to="/launchpad">
              <Button colorScheme="teal" size="md" ml="4" className='css-70qvj9'>
                Mint Launchpad
              </Button>
            </Link>
          </Flex>
        </Flex>

        <div className="nft-gridNFT">
          {nfts.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      </div>
    </>
  );
}

export default MyNFTs;
