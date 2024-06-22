import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import nftAbi from '../ABIs/nftAbi.json';
import usdtAbi from '../ABIs/enoAbi.json';
import './NFTPurchaseCard.css';
import ENOCoin from '../assets/ENOPrice.webp';

const NFTPurchaseCard = ({ nft }) => {
  const [priceUsdt, setPriceUsdt] = useState('');
  const [priceEth, setPriceEth] = useState('');
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  const initializeProvider = () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
    return null;
  };

  const provider = initializeProvider();

  const fetchMintedAndMaxSupply = useCallback(async () => {
    if (!provider) return;

    try {
      const nftContract = new ethers.Contract(nft.contractAddress, nftAbi, provider);
      const totalMintedBigNumber = await nftContract.totalSupply();
      const maxSupplyNumber = await nftContract.max_supply();

      setTotalMinted(totalMintedBigNumber.toNumber());
      setMaxSupply(maxSupplyNumber.toNumber());
    } catch (error) {
      console.error('Error fetching minted and max supply:', error);
    }
  }, [nft.contractAddress, provider]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMintedAndMaxSupply();
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [fetchMintedAndMaxSupply]);

  const buyWithUSDT = async () => {
    if (!provider) {
      toast({
        title: 'MetaMask not installed',
        description: 'Please install MetaMask to proceed.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nft.contractAddress, nftAbi, signer);
    const usdtContract = new ethers.Contract(nft.usdtContractAddress, usdtAbi, signer);

    try {
      const address = await signer.getAddress();
      const priceInUSDT = ethers.utils.parseUnits(priceUsdt, 6);
      const allowance = await usdtContract.allowance(address, nft.contractAddress);

      if (allowance.lt(priceInUSDT)) {
        const approveTx = await usdtContract.approve(nft.contractAddress, priceInUSDT);
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
    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: 'An error occurred during the transaction.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const buyWithETH = async () => {
    if (!provider) {
      toast({
        title: 'MetaMask not installed',
        description: 'Please install MetaMask to proceed.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nft.contractAddress, nftAbi, signer);

    try {
      const priceInETH = ethers.utils.parseEther(priceEth);
      await nftContract.buyNFTWithETH({ value: priceInETH });
      toast({
        title: 'Purchase Successful',
        description: 'You have successfully purchased the NFT with ETH.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: 'An error occurred during the transaction.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCardClick = () => {
    navigate(`/nft/${nft.id}`);
  };

  if (!provider) {
    return <div>Please install MetaMask to view this content.</div>;
  }

  return (
    <div className="nft-purchase-card" onClick={handleCardClick}>
      <video
        src={nft.video}
        alt="NFT Video"
        autoPlay
        muted
        loop
      />
      <div className='purchase__container'>
        <p className='purchase__title'>{nft.title}</p>
        <div>
          <div className='purchase__details-main'>
            <div className='purchase__container-details'>
              <div className='purchase__left-details'>
              <img src={ENOCoin} alt="Eno Price" className='purchase__image' />
              <span className='purchase__eno-price'>{totalMinted} ENO</span>
              </div>

              <div className='purchase__right-details'>
                <p className='purchase__minted-details'>{totalMinted} Editions Released</p>
              </div>
            </div>
          </div>
        </div>
        <p className='purchase__description'>{nft.descriptionShort}</p>
      </div>
      <a href='/nft-detail' colorScheme="teal" size="sm" className='getNFT'>
        <button className='hero__btn-mint color-1'>
          Get NFT
        </button>
      </a>
    </div>
  );
};

export default NFTPurchaseCard;
