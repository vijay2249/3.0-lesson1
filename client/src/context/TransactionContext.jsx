import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'

import {contractAbi, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () =>{
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractAbi, signer);
  return transactionContract
}

export const TransactionProvider = ({children}) =>{
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setFormData] = useState({
    addressTo:'',
    amount:'',
    keyword: '',
    message: ''
  })
  const [isLoading, setisLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))

  const handleChange = (e, name) =>{
    setFormData((prevState)=>({...prevState, [name]:e.target.value}))
  }

  const checkWalletConnection = async () =>{
    try{
      if(!ethereum) return alert("Install metamask or brave wallet")
      const accounts = await ethereum.request({method: 'eth_accounts'})
      if(accounts.length){
        setCurrentAccount(accounts[0])
        // getAllTransactions();
      }else{
        console.log("No Accounts Found");
      }
    }catch(err){
      console.log(err);
      throw new Error("No ETH object")
    }
  }

  const connectWallet = async () =>{
    try{
      if(!ethereum) return alert("Install metamask or brave wallet")
      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      setCurrentAccount(accounts[0])
    }catch(error){
      console.log(error);
      throw new Error("No ETH object")
    }
  }

  const sendTransaction = async () =>{
    try{
      if(!ethereum) return alert("Install metamask or brave wallet")
      const {addressTo, amount, keyword, message} = formData
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount)

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208', //2100 Gwei
          value: parsedAmount._hex
        }]
      })

      const transactionHash = await transactionContract.addToBlockChain(addressTo, parsedAmount, message, keyword)
      setisLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait()
      setisLoading(false);
      console.log(`Success - ${transactionHash.hash}`);
      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())

    }catch(err){
      console.log(err);
      throw new Error("No ETH object");
    }
  }

  useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <TransactionContext.Provider 
      value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
      {children}
    </TransactionContext.Provider>
  )
}