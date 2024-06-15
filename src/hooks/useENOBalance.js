import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const ENO_TOKEN_ADDRESS = '0x2b41806CBf1FFB3D9e31A9ECE6B738Bf9D6f645F';
const ENO_ABI = [
  // Solo necesitamos el ABI para balanceOf
  "function balanceOf(address owner) view returns (uint256)"
];

const useENOBalance = (account) => {
  const [balance, setBalance] = useState('0.00');

  const getENOBalance = useCallback(async () => {
    if (!account) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(ENO_TOKEN_ADDRESS, ENO_ABI, provider);
      const rawBalance = await contract.balanceOf(account);
      const formattedBalance = ethers.utils.formatUnits(rawBalance, 18); // ENO tiene 18 decimales
      setBalance(parseFloat(formattedBalance).toFixed(2)); // Formatear a 2 decimales
    } catch (error) {
      console.error('Failed to get ENO balance:', error);
    }
  }, [account]);

  useEffect(() => {
    getENOBalance();
  }, [getENOBalance]);

  return balance;
};

export default useENOBalance;
