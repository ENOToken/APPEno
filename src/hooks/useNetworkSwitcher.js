import { useState, useCallback, useEffect } from 'react';

const useNetworkSwitcher = () => {
  const [error, setError] = useState(null);
  const [testnet, setTestnet] = useState(false);
  const [chainId, setChainId] = useState("0xa4b1");

  const detectNetwork = useCallback(async () => {
    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(currentChainId);
      if (currentChainId === "0xaa36a7") {
        setTestnet(true);
      } else if (currentChainId === "0xa4b1") {
        setTestnet(false);
      }
    } catch (networkError) {
      setError('Failed to detect network. Please try again or check your connection.');
      console.error(networkError);
    }
  }, []);

  useEffect(() => {
    detectNetwork();

    // Listener for network changes
    const handleChainChanged = () => {
      detectNetwork();
      window.location.reload(); // Reload the page to update the state and UI
    };

    window.ethereum.on('chainChanged', handleChainChanged);

    // Clean up the listener on component unmount
    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [detectNetwork]);

  const changeNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
      setError(null);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ /* Parámetros de la red */ }],
          });
        } catch (addError) {
          setError('Error adding the network. Please try again or check your connection.');
          console.error(addError);
        }
      } else {
        setError('Failed to switch networks. Please try again or check your connection.');
      }
      console.error(switchError);
    }
  }, [chainId]);

  return { changeNetwork, testnet, error };
};

export default useNetworkSwitcher;
