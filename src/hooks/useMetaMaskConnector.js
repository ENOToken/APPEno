//useMetaMaskConnector.js

import { useState, useEffect, useCallback } from 'react';

const useMetaMaskConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');

  const checkConnection = useCallback(async () => {
    try {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setMessage('Connected to MetaMask successfully.');
        } else {
          setIsConnected(false);
          setMessage('MetaMask is not connected.');
        }
      } else {
        setIsConnected(false);
        setMessage('MetaMask is not installed.');
      }
    } catch (error) {
      console.error('Failed to check MetaMask connection:', error);
      setIsConnected(false);
      setMessage('Failed to check MetaMask connection.');
    }
  }, []);

  const connectMetaMask = useCallback(async () => {
    try {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(accounts.length > 0);
        setMessage(accounts.length > 0 ? 'Connected to MetaMask successfully.' : 'MetaMask is not connected.');
      } else {
        setIsConnected(false);
        setMessage('MetaMask is not installed.');
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      setIsConnected(false);
      setMessage('Failed to connect MetaMask. Please try again.');
    }
  }, []);

  useEffect(() => {
    checkConnection();

    // Add event listeners
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      window.ethereum.on('accountsChanged', checkConnection);
      window.ethereum.on('disconnect', () => {
        setIsConnected(false);
        setMessage('MetaMask is not connected.');
      });

      // Cleanup event listeners on component unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', checkConnection);
        window.ethereum.removeListener('disconnect', checkConnection);
      };
    }
  }, [checkConnection]);

  return { isConnected, connectMetaMask, message };
};

export default useMetaMaskConnector;
