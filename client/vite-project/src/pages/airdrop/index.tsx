import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import { encodeConstructorParamsForImplementation } from '@thirdweb-dev/sdk';

//@ts-ignore
export default function Airdrop({account , contracts, balance, epoch}){
    const admin = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    const [airdropAccount, setStakeAccount] = useState(""); // retrieve global address variable
    const [globalContracts, setGlobalContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract, trustStakingHelper: ethers.Contract} | null>(null); // retrieve global contracts variable
    const [trustBalance, setTrustBalance] = useState (""); 
    const [reward, setReward] = useState("");
    const [rewardTemp, setRewardTemp] = useState(0);
    const [accountToBeRewarded, setAccountToBeRewarded] = useState("");

    //refactor by passing into function
    useEffect(() => {
        async function setupContracts() {
            setStakeAccount(account);
            setGlobalContracts(contracts);
            setTrustBalance(balance);
            setReward((await contracts.trustStaking.viewAirdrop(Number(epoch))).toString())
            console.log("airdrop epoch: ", epoch)
            console.log("epoch 0: ", (await contracts.trustStaking.viewAirdrop(0)).toString())
            console.log("epoch 1: ", (await contracts.trustStaking.viewAirdrop(1)).toString())
        }
        setupContracts();
    }, [account, contracts, balance, epoch]);

    //temp function for testing
    const insertReward = async () => {
        if (globalContracts && airdropAccount) {
            try {
                const tx = await globalContracts.trustStaking.insertAirdrop(accountToBeRewarded, rewardTemp, Number(epoch));
                console.log("Insert Successful", tx);
                setReward((await contracts.trustStaking.viewAirdrop(Number(epoch))).toString());
            } catch (error) {
                console.log(error);
            }
        }};

    const claim = async () => {
        if (globalContracts && airdropAccount) {
            try {
                const tx = await globalContracts.trustStaking.claimAirdrop(Number(epoch));
                console.log("Claim Successful", tx);
                setReward((await contracts.trustStaking.viewAirdrop(Number(epoch))).toString());
                //update balance
                setTrustBalance((await contracts.trust.balanceOf(account)).toString());
            } catch (error) {
                console.log(error);
            }
        }};

    const handleRewardChange = (event : any) => {
        setRewardTemp(event.target.value);
    };

    const handleAccountChange = (event : any) => {
        setAccountToBeRewarded(event.target.value);
    };

    
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1>This is the claim airdrop page</h1>
            <h4>Your TRUST balance: {trustBalance ? trustBalance : "Loading"}</h4>
            <h4>Current TRUST Epoch: {epoch ? epoch : "Loading"}</h4>
            <h4>Your airdrop: {reward}</h4>
            {/* Need type checking here */}
            { account === admin ?  
            <>
            <h4> Master Console to insert rewards</h4>
                <input 
                        type="text" 
                        value={rewardTemp} 
                        onChange={handleRewardChange} 
                        style={{margin: '10px 0'}} 
                    />
                <input 
                        type="text" 
                        value={accountToBeRewarded} 
                        onChange={handleAccountChange} 
                        style={{margin: '10px 0'}} 
                    />
                <button 
                        onClick={insertReward} 
                        style={{backgroundColor: 'blue', color: 'white', padding: '10px 20px'}}
                    >
                        Insert Reward
                </button>
            </> : null}

            {Number(reward) > 0 ? 
                <button
                    onClick={claim}
                    style={{backgroundColor: 'red', color: 'white', padding: '10px 20px'}}
                >
                    Claim Airdrop
                </button> : 
                <h4> Airdrops not available, go rate protocols! </h4>}
        </div>
    ) 
}