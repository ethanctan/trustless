import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

//@ts-ignore
export default function Airdrop({account , contracts}){

    const [stakeAccount, setStakeAccount] = useState(""); // retrieve global address variable
    const [globalContracts, setGlobalContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract} | null>(null); // retrieve global contracts variable
    const [trustBalance, setTrustBalance] = useState <0 | null>(null);
    const [epoch, setEpoch] = useState<0 | null>(null);
    const [allowStaking, setAllowStaking] = useState<false | null>(null); 
    const [reward, setReward] = useState(0);
    const [rewardTemp, setRewardTemp] = useState(0);
    const [accountToBeRewarded, setAccountToBeRewarded] = useState("");

    useEffect(() => {
        async function setupContracts() {
        setStakeAccount(account);
        setGlobalContracts(contracts);
        console.log("Stake page global account set: " + account);
        console.log("Stake page global contracts set: " + contracts?.trust.address + " " + contracts?.trustStaking.address);
        setTrustBalance((await contracts.trust.balanceOf(account)).toString());
        setEpoch((await contracts.trustStaking.epochCount()).toString());
        setAllowStaking(await contracts.trustStaking.allowStaking());
        // type casting used here
        const stakerInfo = await contracts.trustStaking.getStakerInfo(Number(epoch), account);
        console.log(stakerInfo)
            if (stakerInfo && stakerInfo.rewardAmount != null) {
                setReward(stakerInfo.rewardAmount.toString());
            } else {
                console.error('Unable to retrieve staker info or reward amount is null.');
                // handle the error or set a default reward
            }
        }
        setupContracts();
    }, [account, contracts]);

    //temp function for testing
    const insertReward = async () => {
        if (globalContracts && stakeAccount) {
            try {
                const tx = await globalContracts.trustStaking.insertAirdropRewards(accountToBeRewarded, rewardTemp);
                console.log("Insert Successful", tx);
                setReward(rewardTemp);
            } catch (error) {
                console.log(error);
            }
        }};

    const claim = async () => {
        if (globalContracts && stakeAccount) {
            try {
                const tx = await globalContracts.trustStaking.airdrop(account);
                console.log("Claim Successful", tx);
            } catch (error) {
                console.log(error);
            }
        }};

    const handleInputChange = (event : any) => {
        setRewardTemp(event.target.value);
    };

    const handleInputChange2 = (event : any) => {
        setAccountToBeRewarded(event.target.value);
    };

    
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1>This is the claim airdrop page</h1>
            <h4>Your TRUST balance: {trustBalance ? trustBalance : "Loading"}</h4>
            <h4>Current TRUST Epoch: {epoch ? epoch : "Loading"}</h4>
            <h4>Staking status: {allowStaking != null ? allowStaking.toString() : "Loading"}</h4>
            <h4>Your airdrop: {reward ? reward : "Loading"}</h4>
            {allowStaking == false ?
            <>
                {/* Need type checking here */}
            <h4> Master Console to insert rewards</h4>
                <input 
                        type="text" 
                        value={rewardTemp} 
                        onChange={handleInputChange} 
                        style={{margin: '10px 0'}} 
                    />
                <input 
                        type="text" 
                        value={accountToBeRewarded} 
                        onChange={handleInputChange2} 
                        style={{margin: '10px 0'}} 
                    />
                <button 
                        onClick={insertReward} 
                        style={{backgroundColor: 'blue', color: 'white', padding: '10px 20px'}}
                    >
                        Insert Reward
                </button>

                {reward > 0 ? 
                    <button
                        onClick={claim}
                        style={{backgroundColor: 'red', color: 'white', padding: '10px 20px'}}
                    >
                        Claim Airdrop
                    </button> : null}
            </> :
            <h2>Window closed, stake more to unlock next Epoch</h2>}
        </div>
    ) 
}