import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

//@ts-ignore
export default function Stake({account , contracts}){

    const [stakeAccount, setStakeAccount] = useState(""); // retrieve global address variable
    const [globalContracts, setGlobalContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract} | null>(null); // retrieve global contracts variable
    const [stakeAmount, setStakeAmount] = useState(0);
    const [trustBalance, setTrustBalance] = useState <0 | null>(null);
    const [epoch, setEpoch] = useState<0 | null>(null);
    const [allowStaking, setAllowStaking] = useState<true | null>(null); 
    const [approved, setApproved] = useState(false);

    useEffect(() => {
        async function setupContracts() {
        setStakeAccount(account);
        setGlobalContracts(contracts);
        console.log("Stake page global account set: " + account);
        console.log("Stake page global contracts set: " + contracts?.trust.address + " " + contracts?.trustStaking.address);
        try {
            // console.log("Your balance:", (await contracts.trust.balanceOf(account)).toString());
            setTrustBalance((await contracts.trust.balanceOf(account)).toString());
            setEpoch((await contracts.trustStaking.epochCount()).toString());
            setAllowStaking((await contracts.trustStaking.allowStaking()).toString());
          } catch (error) {
            console.log(error);
          }
        }
        setupContracts();
    }, [account, contracts]);

    const approve = async () => {
        if (globalContracts && stakeAccount) {
            try {
                const tx = await globalContracts.trust.approve(globalContracts.trustStaking.address, 100000000000)
                console.log("Approve Successful", tx);
                setApproved(true);
            } catch (error) {
                console.log(error);
            }
        }};

    const stake = async () => {
        if (globalContracts && stakeAccount) {
            try {
                const tx = await globalContracts.trustStaking.stakeEpoch(stakeAmount, account);
                console.log("Staking Successful", tx);
                console.log("Staking status:", await globalContracts.trustStaking.allowStaking())
            } catch (error) {
                console.log(error);
            }
        }};

    const handleInputChange = (event : any) => {
        setStakeAmount(event.target.value);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1>This is the staking page</h1>
            <h4>Your TRUST balance: {trustBalance ? trustBalance : "Loading"}</h4>
            <h4>Current TRUST Epoch: {epoch ? epoch : "Loading"}</h4>
            <h4>Staking status: {allowStaking != null ? allowStaking.toString() : "Loading"}</h4>
            {allowStaking == true ? 
                approved ? 
                    <>
                    <input 
                        type="text" 
                        value={stakeAmount} 
                        onChange={handleInputChange} 
                        style={{margin: '10px 0'}} 
                    />
                    <button 
                        onClick={stake} 
                        style={{backgroundColor: 'blue', color: 'white', padding: '10px 20px'}}
                    >
                        Stake
                    </button>
                    </> : 
                    <button 
                        onClick={approve} 
                        style={{backgroundColor: 'blue', color: 'white', padding: '10px 20px'}}
                    >
                        Approve
                    </button>
                :
                <h2>Epoch {epoch} has begun, go to the submit ratings page and submit ratings!</h2>
            }
        </div>
    ) 
}