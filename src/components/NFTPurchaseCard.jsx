import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import nftAbi from '../ABIs/nftAbi.json';
import usdtAbi from '../ABIs/enoAbi.json';
import './NFTPurchaseCard.css';
import ENOCoin from '../assets/ENOPrice.webp';

const NFTPurchaseCard = ({ nft, onGetNFTClick }) => {
  const [priceUsdt, setPriceUsdt] = useState('');
  const [priceEth, setPriceEth] = useState('');
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [saleStartTime, setSaleStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const toast = useToast();

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
      const saleStartTimeNumber = await nftContract.saleStartTime();
      const nftPriceInENOBigNumber = await nftContract.NFTPriceInENO();

      console.log("NFT Price in ENO:", nftPriceInENOBigNumber);

      setTotalMinted(totalMintedBigNumber.toNumber());
      setMaxSupply(maxSupplyNumber.toNumber());
      setSaleStartTime(saleStartTimeNumber.toNumber());
      setPriceUsdt(ethers.utils.formatUnits(nftPriceInENOBigNumber, 18)); // Convertir el BigNumber a string con 18 decimales

      const currentTime = Math.floor(Date.now() / 1000);
      if (saleStartTimeNumber.toNumber() > currentTime) {
        setTimeLeft(calculateTimeLeft(saleStartTimeNumber.toNumber()));
      }
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

  useEffect(() => {
    const timerId = setInterval(() => {
      if (saleStartTime) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (saleStartTime > currentTime) {
          setTimeLeft(calculateTimeLeft(saleStartTime));
        } else {
          setTimeLeft({});
        }
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [saleStartTime]);

  const calculateTimeLeft = (startTime) => {
    const now = Math.floor(Date.now() / 1000);
    const difference = startTime - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (60 * 60 * 24)),
        hours: Math.floor((difference % (60 * 60 * 24)) / (60 * 60)),
        minutes: Math.floor((difference % (60 * 60)) / 60),
        seconds: Math.floor(difference % 60),
      };
    } else {
      return {};
    }
  };

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

  if (!provider) {
    return <div>Please install MetaMask to view this content.</div>;
  }

  return (
    <div className="nft-purchase-card">
      <div className={`nft-video-container ${Object.keys(timeLeft).length !== 0 ? 'blur' : ''}`}>
        <video
          src={nft.video}
          alt="NFT Video"
          autoPlay
          muted
          loop
        />
        {Object.keys(timeLeft).length !== 0 && (
          <div className="countdown-overlay">
            <div className="countdown-timer">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </div>
          </div>
        )}
      </div>
      <div className='purchase__container'>
        <p className='purchase__title'>{nft.title}</p>
        <div>
          <div className='purchase__details-main'>
            <div className='purchase__container-details'>
              <div className='purchase__left-details'>
                <img src={ENOCoin} alt="Eno Price" className='purchase__image' />
                <span className='purchase__eno-price'>{parseFloat(priceUsdt).toFixed(2)} ENO</span>
              </div>

              <div className='purchase__right-details'>
                <p className='purchase__minted-details'>{totalMinted} Editions Released</p>
              </div>
            </div>
          </div>
        </div>
        <p className='purchase__description'>{nft.descriptionShort}</p>
      </div>
      {Object.keys(timeLeft).length === 0 ? (
        <button className='hero__btn-mint color-1' onClick={onGetNFTClick}>
          Get NFT
        </button>
      ) : (
        <button className='hero__btn-mint color-1 disabled' disabled>
          Coming Soon
        </button>
      )}
    </div>
  );
};

export default NFTPurchaseCard;
