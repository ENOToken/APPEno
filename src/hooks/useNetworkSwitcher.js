// hooks/useNetworkSwitcher.js
import { useState, useCallback } from 'react';

const testnet = false;
let chain = "0xa4b1";

if (testnet){
  chain = "0xaa36a7";
}

const useNetworkSwitcher = () => {
  const [error, setError] = useState(null); // Agrega un estado para el error

  const changeNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain }],
      });
      setError(null); // Limpia el error anterior si el cambio de red es exitoso
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ /* Parámetros de la red */ }],
          });
        } catch (addError) {
          // Maneja el error cuando la red no puede ser agregada
          setError('Error adding the network. Please try again or check your connection.');
          console.error(addError);
        }
      } else {
        // Maneja otros errores
        setError('Failed to switch networks. Please try again or check your connection.');
      }
      console.error(switchError);
    }
  }, []);

  return { changeNetwork, testnet, error }; // Devuelve el error junto con las otras variables
};

export default useNetworkSwitcher;