import React, { useState, useEffect, useCallback } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import nftAbi from '../ABIs/nftAbi.json';
import usdtAbi from '../ABIs/usdtAbi.json';
import './NFTPurchaseCard.css';
import './NFTPurchaseCard.css';


const provider = new ethers.providers.Web3Provider(window.ethereum);

const NFTPurchaseCard = ({ nft }) => {
  const [priceUsdt, setPriceUsdt] = useState('');
  const [priceEth, setPriceEth] = useState('');
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const toast = useToast();

  const fetchPrices = useCallback(async () => {
    const nftContract = new ethers.Contract(nft.contractAddress, nftAbi, provider);
    const usdtPriceBigNumber = await nftContract.NFTPriceInUSDT();
    const ethPriceBigNumber = await nftContract.getEquivalentETH();
  
    // Convertir BigNumber a string sin decimales para USDT
    const usdtPrice = usdtPriceBigNumber.div(1e6).toString();
    setPriceUsdt(ethers.utils.formatUnits(usdtPrice, 0));
  
    // Convertir BigNumber a string y recortar a 6 decimales para ETH
    let ethPriceString = ethers.utils.formatEther(ethPriceBigNumber);
    ethPriceString = parseFloat(ethPriceString).toFixed(6); // Asegúrate de que no redondee a más de 6 decimales
    setPriceEth(ethPriceString);
  }, [nft.contractAddress]);
  

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // Actualiza los precios cada 5 segundos
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const fetchMintedAndMaxSupply = useCallback(async () => {
    const nftContract = new ethers.Contract(nft.contractAddress, nftAbi, provider);
    const totalMintedBigNumber = await nftContract.totalSupply(); // La función totalSupply() de ERC721Enumerable
    const maxSupplyNumber = await nftContract.max_supply(); // Llamada a la función getter
  
    setTotalMinted(totalMintedBigNumber.toNumber());
    setMaxSupply(maxSupplyNumber.toNumber()); // Suponiendo que max_supply se ajusta a un número primitivo
  }, [nft.contractAddress]);  

  useEffect(() => {
    const fetchData = async () => {
      await fetchPrices();
      await fetchMintedAndMaxSupply();
    };
  
    fetchData(); // Ejecutar inmediatamente una vez al montar el componente
  
    const intervalId = setInterval(fetchData, 5000); // Establecer el intervalo para ejecutar cada 5 segundos
  
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, [fetchPrices, fetchMintedAndMaxSupply]);  

  const buyWithUSDT = async () => {
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

 const NFTPurchaseCard = ({ nft }) => {
  const history = useHistory();

  const handleCardClick = () => {
    history.push(`/nft/${nft.id}`);
  };

  return (
    <div className="nft-purchase-card" onClick={handleCardClick}>
      <img src={nft.image} alt={nft.title} />
      <p>{nft.title}</p>
    </div>
  );
 };

  return (
    <div className="nft-purchase-card">
      <video
        src={nft.image}
        alt="NFT Video"
        autoPlay
        muted
        loop
        style={{ maxWidth: '300px', width: '100%' }}
      />
      <div className='purchase__container'>
      <p className='purchase__title'>{nft.title}</p> 
      <p className='text__content'>Minted: {totalMinted} | {maxSupply} NFTs</p>
      <p className='text__content'>Price: {priceUsdt} USDT | {priceEth} ETH</p>
      </div>
      <Button colorScheme="teal" size="sm" onClick={buyWithUSDT}>
        Buy with USDT
      </Button>
      <Button colorScheme="teal" size="sm" onClick={buyWithETH}>
        Buy with ETH
      </Button>
    </div>
  );
};

export default NFTPurchaseCard;