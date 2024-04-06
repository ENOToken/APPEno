// hooks/useMetaMaskConnector.js
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

const useMetaMaskConnector = () => {
  const [isConnected, setIsConnected] = useState(false);

  const connectMetaMask = useCallback(async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      setIsConnected(false);
    }
  }, []);

  return { isConnected, connectMetaMask };
};

export default useMetaMaskConnector;
