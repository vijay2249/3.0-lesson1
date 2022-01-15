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
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
  const [transactions, setTransactions] = useState([])

  const handleChange = (e, name) =>{
    setFormData((prevState)=>({...prevState, [name]:e.target.value}))
  }

  const ErrorMsg = (err, fromFunction='') =>{
    console.log(err);
    console.log(fromFunction);
    throw new Error("No ETH object found")
  }

  const getAllTransactions = async () =>{
    try{
      if(!ethereum) return alert("Install metamask or brave wallet")
      const transactionContract = getEthereumContract();
      const availableTransactions =  await transactionContract.getAllTransactions();
      const readableTransactions = availableTransactions.map(transaction =>({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber()*1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex)/(10**18)
      }))
      setTransactions(readableTransactions)
    }catch(err){
      ErrorMsg(err, 'getAllTransactions')
    }
  }

  const checkWalletConnection = async () =>{
    try{
      if(!ethereum) return alert("Install metamask or brave wallet")
      const accounts = await ethereum.request({method: 'eth_accounts'})
      if(accounts.length){
        setCurrentAccount(accounts[0])
        getAllTransactions();
      }else{
        console.log("No Accounts Found");
      }
    }catch(err){
      ErrorMsg(err, 'checkWalletConnection');
    }
  }

  const checkTransactions = async () =>{
    try{
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount()
      window.localStorage.setItem('transactionCount', transactionCount)
    }catch(err){
      ErrorMsg(err, 'checkTransactions')
    }
  }

  const connectWallet = async () =>{
    try{
      if(!ethereum) return alert("Install metamask or brave wallet")
      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      setCurrentAccount(accounts[0])
    }catch(error){
      ErrorMsg(error, 'connectWallet')
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
      setIsLoading(true);
      await transactionHash.wait()
      setIsLoading(false);
      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
      // setFormData({addressTo:'', amount:'', keyword: '', message: '' })
      window.reload();
    }catch(err){
      ErrorMsg(err, 'sendTransaction')
    }
  }

  useEffect(() => {
    checkWalletConnection();
    checkTransactions();
  }, []);

  return (
    <TransactionContext.Provider 
      value={{connectWallet, currentAccount, formData, handleChange, sendTransaction, transactions, isLoading}}>
      {children}
    </TransactionContext.Provider>
  )
}