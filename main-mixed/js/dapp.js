import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../constants/abi.js";
import address from "../constants/address.json";
import Tooltip from "@material-ui/core/Tooltip";
import buttonImage from '../images/button.png';
import connectImage from "../images/connect.png";

/*eslint-disable */
const MAX_SUPPLY = 7777;

/* eslint-enable */


const React = require('react');
const ReactDOM = require('react-dom');

const Showcase = (props) => {
  const [counter, setCounter] = useState(5);

  const [mintedCount, setMintedCount] = useState(0);
// eslint-disable-next-line
  const [account, setAccount] = useState("");
  /* eslint-disable */
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  /* eslint-enable */

  const [Contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [remainingTokens, setRemainingTokens] = useState(MAX_SUPPLY);
  const [isConnected, setIsConnected] = useState(false);
  


  /* eslint-disable */
  useEffect(() => {
  
  }, []);
  /* eslint-enable */

  const connectWallet = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      
        // Only connect wallet if account is not set
        if (!(window.ethereum.networkVersion === "1")) {
          try {
            await switchNetwork();
            setIsConnected(false);
            
          } catch (err) {
            console.log(err);
            console.log("Connect wallet button clicked");

            alert("Switch your network to Mainnet");
            return;
          }
        }
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          accountChanged(accounts[0]);
        }
      
    } else {
      alert("Please install Metamask");
    }
  };

  async function switchNetwork() {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }], // chainId must be in HEX with 0x in front
    });
  }

  const accountChanged = (newAcc) => {
    setAccount(newAcc);
    setIsConnected(true);
    loadEthersProperties();
  };

  const loadEthersProperties = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.contract(address.address, abi, tempSigner);
    setContract(tempContract);

    // Get the total supply and update the state
    tempContract.totalSupply().then((result) => {
      setTotalSupply(result);
    });
  };

  const calculateCost = (quantity) => {
  const cost = ethers.utils.parseEther("0.003"); // Set the cost per token
  let totalCost = cost.mul(quantity);

  // Apply 5% discount for purchases of 50 or more tokens
  if (quantity >= 50) {
    const discount = totalCost.mul(5).div(100);
    totalCost = totalCost.sub(discount);
  }

  return totalCost;
};


  const mint = async () => {
    if (!isConnected) {
      alert("Please connect your wallet before minting.");
      return;
    }
    const quantity = counter;
    const totalCost = calculateCost(quantity);

    setMintedCount(mintedCount + counter);
    const remaining = remainingTokens - quantity;
    setRemainingTokens(remaining);

    try {
      const supply = await contract.totalSupply();
      const remaining = MAX_SUPPLY - supply;
      // update the remaining tokens in the state
      setRemainingTokens(remaining);
      await contract.mint(quantity, {
        value: totalCost,
      });
      setCounter(5);
    } catch (err) {
      alert(
        `Please make sure you have enough ETH in your wallet to cover the gas fee and the cost of the NFT.`
      
      );
    }
  };
}

export default Showcase;
