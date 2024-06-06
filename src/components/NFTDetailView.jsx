import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, useToast, Spinner } from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ethers } from 'ethers';
import nftAbi from '../ABIs/nftAbi.json';
import enoAbi from '../ABIs/enoAbi.json';
import demo from '../assets/BlackBox.mp4';
import './NFTDetailView.css';

const NFTDetailView = ({ setHeaderVisible, setFooterVisible, setNavBarVisible }) => {
  const { nftId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [nftDetails, setNftDetails] = useState(null);
  const [priceEno, setPriceEno] = useState('');
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const enoPriceBigNumber = await nftContract.NFTPriceInENO();

    const enoPrice = ethers.utils.formatUnits(enoPriceBigNumber, 18);
    setPriceEno(parseInt(enoPrice)); // Convertir el precio a entero para quitar los decimales
  }, [provider]);

  const fetchMintedAndMaxSupply = useCallback(async (nft) => {
    if (!provider) return;
    const nftContract = new ethers.Contract(nft.contractAddress, nftAbi, provider);
    const totalMintedBigNumber = await nftContract.totalSupply();
    const maxSupplyNumber = await nftContract.max_supply();

    setTotalMinted(totalMintedBigNumber.toNumber());
    setMaxSupply(maxSupplyNumber.toNumber());
  }, [provider]);

  useEffect(() => {
    if (nftDetails) {
      fetchPrices(nftDetails);
      fetchMintedAndMaxSupply(nftDetails);
      const intervalId = setInterval(() => {
        fetchPrices(nftDetails);
        fetchMintedAndMaxSupply(nftDetails);
      }, 5000); // Establecer el intervalo para ejecutar cada 5 segundos

      return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
    }
  }, [nftDetails, fetchPrices, fetchMintedAndMaxSupply]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 1024) { // Tablets y móviles
        setHeaderVisible(false);
        setFooterVisible(false);
        setNavBarVisible(false);
      } else {
        setHeaderVisible(true);
        setFooterVisible(true);
        setNavBarVisible(true);
      }
    };

    // Configurar el evento de redimensionamiento
    window.addEventListener('resize', handleResize);

    // Llamar a handleResize inicialmente para configurar el estado correcto
    handleResize();

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
      setHeaderVisible(true);
      setFooterVisible(true);
      setNavBarVisible(true);
    };
  }, [setHeaderVisible, setFooterVisible, setNavBarVisible]);

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

    return true;
  };

  const buyWithENO = async () => {
    if (!signer || !nftDetails || !validateContractAddresses()) {
      toast({
        title: 'Invalid NFT Details',
        description: 'NFT details are invalid or not available.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const nftContract = new ethers.Contract(nftDetails.contractAddress, nftAbi, signer);
      const enoTokenAddress = await nftContract.enoToken();
      const enoContract = new ethers.Contract(enoTokenAddress, enoAbi, signer);

      const priceInENOBigNumber = await nftContract.NFTPriceInENO();
      const priceInENO = ethers.utils.formatUnits(priceInENOBigNumber, 18);

      const address = await signer.getAddress();
      const priceInENOBN = ethers.utils.parseUnits(priceInENO, 18);
      const allowance = await enoContract.allowance(address, nftDetails.contractAddress);

      if (allowance.lt(priceInENOBN)) {
        const approveTx = await enoContract.approve(nftDetails.contractAddress, priceInENOBN);
        await approveTx.wait();
      }

      const buyTx = await nftContract.buyNFTWithENO();
      await buyTx.wait();

      toast({
        title: 'Purchase Successful',
        description: 'You have successfully purchased the NFT with ENO.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/my-nft'); // Redirigir después de la compra exitosa
    } catch (error) {
      if (error.code === 4001) {
        // User denied transaction signature
        toast({
          title: 'Transaction Denied',
          description: 'You denied the transaction signature.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error('Error during transaction:', error);
        toast({
          title: 'Purchase Failed',
          description: `An error occurred during the transaction: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!nftDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <Spinner size="xl" />
        </div>
      )}
      <div className={`nft-detail-container ${loading ? 'blurred' : ''}`}>
        <a href='/launchpad' className='back__button' rel="noopener noreferrer">
          <FontAwesomeIcon icon={faChevronLeft} />
        </a>
        <div className="nft-detail-video">
          <video src={nftDetails.video} autoPlay loop muted></video>
        </div>
        <div className="nft-detail-content">
          <div className='NFT__line-container'>
            <p className='NFT__line'></p>
          </div>

          <div className='backButton__Container'>
            <div className='backButton__left'>
              <a href='/launchpad' className='back__buttonDesktop' rel="noopener noreferrer">
                <FontAwesomeIcon icon={faChevronLeft} />
              </a>
            </div>
            <div className='backButton__right' >
              <a href='/launchpad'>
              <h2>Back</h2>
              </a>
            </div>
          </div>

          <h2 className='NFT__title'>{nftDetails.title}</h2>
          <div className='NFT__description'>
            <div className='NFT__buttons'>
              <p className='NFT__content'>Minted: {totalMinted} / {maxSupply}</p>
              <p className='NFT__content'>Price: {priceEno} ENO</p>
            </div>
            <h2 className='about__nft'>ABOUT NFT</h2>
            <p>{nftDetails.description}</p>
          </div>
          <div className='NFT__btnENO'>
            <Button className="NFT__btn color-1" colorScheme="teal" size="sm" onClick={buyWithENO} isDisabled={loading}>
              Buy with ENO
            </Button>
          </div>
        </div>
      </div>

      {/* ======= What Are Eno Badges - Video ======= */}
      <div className="badges__container">
        <div className="container__NFT__left">
          <h2 className="hero__NFT__title">What are ENO Badges?</h2>
          <p className="text__NFT__subtitle">ENO‘s Badges are NFTs that verify your participation in an activity within our social ecosystem.</p>
          <a href="https://docs.enotoken.io/" target="_blank" rel="noopener noreferrer" className='NFT__container'>
            <button className="NFT__btn">
              Read More in Whitepaper
            </button>
          </a>
        </div>
        <div className="container__NFT__right">
          <video src={demo} autoPlay loop muted></video>
        </div>
      </div>
    </>
  );
};

export default NFTDetailView;
