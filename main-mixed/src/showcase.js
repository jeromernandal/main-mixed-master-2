    import React, { useState, useEffect } from 'react';
    import Web3 from "web3";
    import { ethers } from 'ethers';
    import detectEthereumProvider from "@metamask/detect-provider";
    import MyComponent from "./MyComponent";
    import contractAddress from "./contractAddress";
    import abi from "./abi";
    import { getContract } from "./getContract";
    import { getContractInstance } from "./getContractInstance";



    
    function Showcase() {
    const [isConnected, setIsConnected] = useState(false);
    const [network, setNetwork] = useState("");
    const [account, setAccount] = useState("");
    console.log(ethers);

    useEffect(() => {
        const init = async () => {
        const provider = await detectEthereumProvider();

        if (provider) {
            const accounts = await provider.request({ method: "eth_accounts" });

            if (accounts.length > 0) {
            accountChanged(accounts[0]);
            }

            provider.on("accountsChanged", (accounts) => {
            accountChanged(accounts[0]);
            });

            provider.on("networkChanged", (network) => {
            setNetwork(network);
            });
        }
        };

        init();
    }, []);

    const switchNetwork = async () => {
        try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }],
        });
        } catch (err) {
        console.log(err);
        throw new Error("Could not switch network");
        }
    };

    const accountChanged = async (account) => {
        setIsConnected(true);
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network.chainId);
    };
    async function app(mint) {
        try {
          await contract.methods.mint(1).send({from: accounts[0], value: web3.utils.toWei('0.003', 'ether')});
          const contract = new ethers.Contract(contractAddress, abi, signer);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          
          const result = await contract.mint(mint);
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      }
      

    const connectWallet = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
          // Only connect wallet if account is not set
          if (!isConnected) {
            if (!(window.ethereum.networkVersion === "5")) {
              try {
                await switchNetwork();
                setIsConnected(false);
              } catch (err) {
                console.log(err);
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
            // Call the mint function
            try {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();
              const Contract = new ethers.Contract(contractAddress, abi, signer);
              const result = await Contract.mint();
              console.log(result);
            } catch (error) {
              console.error(error);
            }
          }
        } else {
          alert("Please install Metamask");
        }
      };
      
    return (
        <div className="container">
  
        
            <button
            className="primary-button hero w-button"
            onClick={connectWallet}
            >
            {isConnected
                ? `${account.substr(0, 6)}...${account.substr(-4)}`
                : "Connect Wallet"}
            </button>
            {isConnected && (
            <p>
                Connected to {network === "5" ? "Mainnet" : "Testnet"} with address{" "}
                {account}
            </p>
            )}
        
        </div>
    );
    }
    ReactDOM.render(
      <React.StrictMode>
        <MyComponent />
      </React.StrictMode>,
      document.getElementById('root')
    );
    
    export default Showcase;
