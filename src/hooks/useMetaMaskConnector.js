import { useState, useCallback } from 'react';

const useMetaMaskConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(''); // Agregar estado de mensaje

  const connectMetaMask = useCallback(async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
      /* setMessage('Connected to MetaMask successfully.'); // Establecer mensaje de éxito */
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      setIsConnected(false);
      setMessage('Failed to connect MetaMask. Please try again.'); // Establecer mensaje de error
    }
  }, []);

  return { isConnected, connectMetaMask, message }; // Devolver mensaje
};

export default useMetaMaskConnector;
