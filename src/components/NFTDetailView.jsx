import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, useToast } from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ethers } from 'ethers';
import nftAbi from '../ABIs/nftAbi.json';
import usdtAbi from '../ABIs/usdtAbi.json';
import './NFTDetailView.css';

const NFTDetailView = () => {
  const { nftId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [nftDetails, setNftDetails] = useState(null);
  const [priceUsdt, setPriceUsdt] = useState('');
  const [priceEth, setPriceEth] = useState('');
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        setSigner(web3Provider.getSigner());
      }).catch((error) => {
        console.error('User denied account access', error);
        toast({
          title: 'Account access denied',
          description: 'You need to grant account access to use this feature.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    } else {
      console.error('MetaMask is not installed');
      toast({
        title: 'MetaMask not installed',
        description: 'Please install MetaMask to use this feature.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetch('/nftData.json')
      .then(response => response.json())
      .then(data => {
        if (data[nftId]) {
          setNftDetails(data[nftId]);
          fetchPrices(data[nftId]);
          fetchMintedAndMaxSupply(data[nftId]);
        } else {
          console.error('NFT ID not found in data');
        }
      })
      .catch(error => console.error('Error loading NFT data:', error));
  }, [nftId]);

  const fetchPrices = useCallback(async (nft) => {
    if (!provider) return;
    const nftContract = new ethers.Contract(nft.contractAddress, nftAbi, provider);
    const usdtPriceBigNumber = await nftContract.NFTPriceInUSDT();
    const ethPriceBigNumber = await nftContract.getEquivalentETH();

    const usdtPrice = usdtPriceBigNumber.div(1e6).toString();
    setPriceUsdt(ethers.utils.formatUnits(usdtPrice, 0));

    let ethPriceString = ethers.utils.formatEther(ethPriceBigNumber);
    ethPriceString = parseFloat(ethPriceString).toFixed(6);
    setPriceEth(ethPriceString);
  }, [provider]);

  const fetchMintedAndMaxSupply = useCallback(async (nft) => {
    if (!provider) return;
    const nftContract = new ethers.Contract(nft.contractAddress, nftAbi, provider);
    const totalMintedBigNumber = await nftContract.totalSupply();
    const maxSupplyNumber = await nftContract.max_supply();

    setTotalMinted(totalMintedBigNumber.toNumber());
    setMaxSupply(maxSupplyNumber.toNumber());
  }, [provider]);

  const validateContractAddresses = () => {
    if (!nftDetails) {
      console.error('NFT details not available');
      toast({
        title: 'NFT details not available',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!ethers.utils.isAddress(nftDetails.contractAddress)) {
      console.error('Invalid contract address');
      toast({
        title: 'Invalid contract address',
        description: 'The contract address is invalid.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!ethers.utils.isAddress(nftDetails.usdtContractAddress)) {
      console.error('Invalid USDT contract address');
      toast({
        title: 'Invalid USDT contract address',
        description: 'The USDT contract address is invalid.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const buyWithUSDT = async () => {
    if (!signer || !nftDetails || !validateContractAddresses()) return;
    try {
      const nftContract = new ethers.Contract(nftDetails.contractAddress, nftAbi, signer);
      const usdtContract = new ethers.Contract(nftDetails.usdtContractAddress, usdtAbi, signer);

      const address = await signer.getAddress();
      const priceInUSDT = ethers.utils.parseUnits(priceUsdt, 6);
      const allowance = await usdtContract.allowance(address, nftDetails.contractAddress);

      if (allowance.lt(priceInUSDT)) {
        const approveTx = await usdtContract.approve(nftDetails.contractAddress, priceInUSDT);
        await approveTx.wait();
      }

      const buyTx = await nftContract.buyNFTWithUSDT();
      await buyTx.wait();

      toast({
        title: 'Purchase Successful',
        description: 'You have successfully purchased the NFT with USDT.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/my-nft'); // Redirigir después de la compra exitosa
    } catch (error) {
      console.error('Error during transaction:', error);
      toast({
        title: 'Purchase Failed',
        description: `An error occurred during the transaction: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const buyWithETH = async () => {
    if (!signer || !nftDetails || !validateContractAddresses()) return;
    try {
      const nftContract = new ethers.Contract(nftDetails.contractAddress, nftAbi, signer);

      const priceInETH = ethers.utils.parseEther(priceEth);
      await nftContract.buyNFTWithETH({ value: priceInETH });
      toast({
        title: 'Purchase Successful',
        description: 'You have successfully purchased the NFT with ETH.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/my-nft'); // Redirigir después de la compra exitosa
    } catch (error) {
      console.error('Error during transaction:', error);
      toast({
        title: 'Purchase Failed',
        description: `An error occurred during the transaction: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!nftDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="nft-detail-container">
      <a
        href='/launchpad'
        className='back__button'
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </a>
      <div className="nft-detail-video">
        <video src={nftDetails.video} autoPlay loop muted></video>
      </div>
      <div className="nft-detail-content">
        <div className='NFT__line-container'>
          <p className='NFT__line'></p>
        </div>
        <h2 className='NFT__title'>{nftDetails.title}</h2>
        <p className='NFT__description'>{nftDetails.description}</p>
        <div className='NFT__buttons'>
          <Button colorScheme="teal" size="sm" onClick={buyWithUSDT}>
            Buy with USDT
          </Button>
          <Button colorScheme="teal" size="sm" onClick={buyWithETH}>
            Buy with ETH
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailView;
