import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import Web3 from "web3";
import { ethers } from 'ethers';
import abi from './src/abi.js';
import { contractAddress } from './contractAddress.js';

const web3 = new Web3(window.ethereum);
let contractInstance;
let accounts;

const connectWallet = async () => {
  // Check if the user has Metamask installed
  if (typeof window.ethereum === 'undefined') {
    alert('Please install Metamask to use this feature');
    return;
  }

  // Request access to the user's Metamask account
  accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Load contract instance
  contractInstance = new web3.eth.Contract(abi, contractAddress);

  // Change the text of the button to "Mint"
  const connectWalletButton = document.getElementById('connectWallet');
  connectWalletButton.textContent = 'mint';
  connectWalletButton.removeAttribute('id');

  // Add a new click listener to the button for minting
  connectWalletButton.addEventListener('click', mint);
};

async function mint() {
  try {
    const numTokens = parseInt(document.getElementById('numTokens').value);
    const setCost = await contractInstance.methods.setCost().call(); // read the setCost value from the contract
    const mintParams = { from: accounts[0], value: setCost };
    const result = await contractInstance.methods.mint(numTokens).send(mintParams);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

const MyComponent = ({ isConnected, connectWallet, mint }) => {
  if (isConnected) {
    return (
      <div>
        <p>You are connected to your wallet.</p>
        <button id="mint-button" onClick={mint}>Mint</button>
        <input id="numTokens" type="number" placeholder="Enter number of tokens" />
      </div>
    );
  } else {
    return (
      <div>
        <p>Please connect your wallet to continue.</p>
        <button id="connectWallet" onClick={connectWallet}>Connect Wallet</button>
      </div>
    );
  }
};

async function init() {
  try {
    // Check if the user has Metamask installed
    if (typeof window.ethereum === 'undefined') {
      alert('Please install Metamask to use this feature');
      return;
    }

    // Request access to the user's Metamask account
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create an ethers.js provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create an instance of your smart contract
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Call the mint function
    const setCost = await contract.cost();
    console.log(transaction);
  } catch (error) {
    console.error(error);
  }
}

ReactDOM.render(<MyComponent isConnected={false} connectWallet={connectWallet} mint={mint} />, document.getElementById('root'));
