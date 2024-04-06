// hooks/useNetworkSwitcher.js
import { useCallback } from 'react';

const useNetworkSwitcher = () => {
  const changeNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ /* Parámetros de la red */ }],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(switchError);
    }
  }, []);

  return changeNetwork;
};

export default useNetworkSwitcher;