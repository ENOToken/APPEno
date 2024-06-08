// useNetworkSwitcher.js
import { useState, useEffect, useCallback } from 'react';

const chain = "0xa4b1"; // Arbitrum

const useNetworkSwitcher = () => {
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [error, setError] = useState(null);

  const checkNetwork = useCallback(async () => {
    try {
      if (window.ethereum) {
        const network = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentNetwork(network);
        console.log(`Check Network - Current Network: ${network}`);
        if (network !== chain) {
          setError('Incorrect network. Please switch to the correct network.');
        } else {
          setError(null);
        }
      }
    } catch (error) {
      console.error('Failed to check network:', error);
      setError('Failed to check network.');
    }
  }, []);

  const changeNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain }],
      });
      checkNetwork(); // Ensure state updates after network change
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ /* Network parameters */ }],
          });
          checkNetwork(); // Ensure state updates after adding network
        } catch (addError) {
          setError('Error adding the network. Please try again or check your connection.');
          console.error(addError);
        }
      } else {
        setError('Failed to switch networks. Please try again or check your connection.');
        console.error(switchError);
      }
    }
  }, [checkNetwork]);

  useEffect(() => {
    checkNetwork();

    // Add listener for network changes
    const handleChainChanged = (networkId) => {
      console.log('Network changed');
      setCurrentNetwork(networkId);
      console.log(`Updated Network: ${networkId}`);
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup listener on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkNetwork]);

  return { currentNetwork, changeNetwork, error };
};

export { useNetworkSwitcher, chain };
