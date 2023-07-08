import { v1 as generateUuidv1 } from 'uuid';
import Cookies from 'js-cookie';
import { addUser, addRating, checkUser, updateRating, getUserInfo, checkCookie, getProtocolRatings, addReferral} from '../../utils/utils.ts';
import React, {useState, useEffect, useMemo} from 'react';
import { ethers } from 'ethers';
import Form from './form.tsx';
import {NewUser, Rating, ProtocolRatings, UserReferral} from '../../utils/interfaces.ts'
import { GetProtocolResponse, DefiData} from '../../utils/interfaces.ts'
import Axios from 'axios';

function FormController(){

    const [defiData, setDefiData] = useState<DefiData[]>([]);

    useEffect(() => {
        Axios.get<DefiData[]>('http://localhost:3001/defiData').then((response) => {
      setDefiData(response.data);
    });
    }, [])

    function getUserCookie(){
        let cookieAddr = Cookies.get("user_id")
        if (cookieAddr === undefined){
            cookieAddr = generateUuidv1()
            Cookies.set('user_id', cookieAddr)
        }
        return cookieAddr
    }
    //What error should I throw here
    // Why are we only getting info from address?
    async function getUser(cookieAddr : string){
        const exists = await checkCookie(cookieAddr)
        if (exists){
            const response = await getUserInfo(cookieAddr)
            console.log("response referral code: ", response.referralCode)

            return response
        }
        return null
    }

    async function getUserData(){
        let cookieAddress = getUserCookie()
        let user = await getUser(cookieAddress)
        return [cookieAddress, user]
    }

    async function addUserRating(user_id : string, address : string, protocol : string, 
        newRating : Rating){
            try{
                await addRating(user_id, address, protocol, newRating);
                return "Successfully added!"
            }catch(error:any) {
                if (error.response && error.response.status === 400){
                return "You have already rated this protocol."
        }}
    }

    async function getRatings(user_id : string, address : string){
        const response1 = await getProtocolRatings(user_id, address);
        if (response1 != null) {
            return response1
        }
        throw new Error("No response")
    }

    async function handleUserSubmission(rating : Rating, 
        address: string, user_id : string, protocol: string){ 
      
          const influencerExists = await checkUser(rating["code"]); //check if influencer exists
          if (!influencerExists){
            throw new Error("Influencer does not exist. Try again or leave blank!")
          }
          if (address == null) {
            throw new Error("Wallet not connected. Try again!")
          }

        //add referral to influencer
        if (rating["code"] && rating["code"] !== "") {
            let userReferral:UserReferral = {
            protocol:protocol
            }
            await addReferral(rating["code"], address, userReferral);
        }

        let rating_msg = await addUserRating(user_id, address, protocol, rating)
        let response1 = await getRatings(user_id, address)
        return [rating_msg, response1]
        
      }; 

    // function to connect to metamask and create new user
  async function connectMetamask(user_id : string) {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No Ethereum interface injected into browser. Read-only access');
    }
    // Ethereum user detected. You can now use the provider.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Request the user to grant access to their MetaMask
    await window.ethereum.enable(); 
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    console.log("Account: ", account)
    if (account == null) {
        console.log("Address is null")
        return
    }
    addUser(user_id, account);
    return account

  }

  async function updateProtocol(rating : Rating,
    user_id : string, address : string, protocol : string) {

    //check if influencer exists
    const exists = await checkUser(rating["code"]) 
    await updateRating(user_id, address, protocol, rating)
    if (!exists){
        throw new Error("Influencer code does not exist. Try again!")
    }
    if (address == null) {
        throw new Error("Wallet not connected. Try again!")
    }
    
    return getRatings(user_id, address)
  }

  return (
    <Form 
        defiData={defiData}
        getUserData={getUserData}
        connectMetamask={connectMetamask}
        updateProtocol={updateProtocol}
        handleUserSubmission={handleUserSubmission}
    />
  )
}

export default FormController



