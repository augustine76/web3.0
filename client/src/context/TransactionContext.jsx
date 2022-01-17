import React, {useEffect, useState} from "react";
import {ethers} from 'ethers';


import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);


    console.log({provider, signer, transactionContract});
}

export const TransactionProvider = ( {children} ) => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [formData, setformData] = useState({addressTo: '', amount:'', keyword:'', message:''});

    const handleChange = (e, name) => {
        setformData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const checkIfWalletIsConnected = async () => {
        if(!ethereum)
            return alert("Please install MetaMask");
        const accounts = await ethereum.request({method: "eth_accounts"});
        console.log(accounts);
        if(accounts.length){
            setCurrentAccount(accounts[0]);
        } else {
            console.log("No accounts found.");
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum)
                return alert("Please install MetaMask");
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);

            throw new Error("No ethereum object.");
        }
    }
    const sendTransaction = async () => {
        if(!ethereum) return alert("Please install MetaMask");
        const {addressTo, amount, keyword, message} = formData;
        getEthereumContract();

    }

    useEffect( () => {
        checkIfWalletIsConnected();
    },[]);

    return(
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setformData, handleChange, sendTransaction}} >
            {children}
        </TransactionContext.Provider>
    )
}