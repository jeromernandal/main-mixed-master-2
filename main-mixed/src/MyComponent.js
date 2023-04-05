// MyComponent.js
import { useState } from 'react';
import { ethers } from 'ethers';

import { contractAddress } from './contractaddress.js';

console.log(`The contract address is ${contractAddress}`);

function MyComponent() {
  const [isConnected, setIsConnected] = useState(false);
  const [numTokens, setNumTokens] = useState(1);

  const connectWallet = async () => {
    try {
      await window.ethereum.enable();
      setIsConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const mint = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log('Contract instance:', contract);
    try {
      // Get token price from contract
      const tokenPrice = await contract.price();
      const priceInWei = ethers.utils.parseEther(tokenPrice);
      const value = priceInWei.mul(numTokens);

      try {
        const tx = await contract.mint(numTokens, {
          value: value,
        });
        console.log('Transaction hash:', tx.hash);
        alert(`Transaction submitted: ${tx.hash}`);
      } catch (error) {
        console.error(error);
        alert(`Error minting tokens: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error getting token price: ${error.message}`);
    }
  };

  const handleNumTokensChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setNumTokens(value);
    }
  };

  const handleDecrementClick = () => {
    if (numTokens > 1) {
      setNumTokens(numTokens - 1);
    }
  };

  const handleIncrementClick = () => {
    setNumTokens(numTokens + 1);
  };

  return (
    <div>
      <div className="counter">
        <button className="counter-btn decrement" onClick={handleDecrementClick}>-</button>
        <input type="text" className="counter-input" value={numTokens} onChange={handleNumTokensChange} min="1" />
        <button className="counter-btn increment" onClick={handleIncrementClick}>+</button>
      </div>
      {isConnected ? (
        <button className="primary-button hero w-button" onClick={() => mint(numTokens)} disabled={numTokens < 1}>
          Mint
        </button>
      ) : (
        <button className="primary-button hero w-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default MyComponent;
