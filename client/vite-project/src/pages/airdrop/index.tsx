import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import { encodeConstructorParamsForImplementation } from '@thirdweb-dev/sdk';

//@ts-ignore
export default function Airdrop({account , contracts, balance, epoch, stakingStatus}){

    const [airdropAccount, setStakeAccount] = useState(""); // retrieve global address variable
    const [globalContracts, setGlobalContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract} | null>(null); // retrieve global contracts variable
    const [trustBalance, setTrustBalance] = useState ("");
    const [airdropEpoch, setEpoch] = useState("");
    const [allowStaking, setAllowStaking] = useState("");
    const [reward, setReward] = useState(0);
    const [rewardTemp, setRewardTemp] = useState(0);
    const [accountToBeRewarded, setAccountToBeRewarded] = useState("");
    const [remainingRewards, setRemainingRewards] = useState("");

    //refactor by passing into function
    useEffect(() => {
        async function setupContracts() {
        setStakeAccount(account);
        setGlobalContracts(contracts);
        setTrustBalance(balance);
        setEpoch(epoch);
        setAllowStaking(stakingStatus);
        setRemainingRewards((await contracts.trustStaking.getTotalTrustReward(Number(epoch))).toString());
        console.log("Done")
        
        // type casting used here
        // const stakerInfo = await contracts.trustStaking.getStakerInfo(Number(airdropEpoch), account);
        // console.log(stakerInfo)
        //     if (stakerInfo && stakerInfo.rewardAmount != null) {
        //         setReward(stakerInfo.rewardAmount.toString());
        //     } else {
        //         console.error('Unable to retrieve staker info or reward amount is null.');
        //         // handle the error or set a default reward
        //     }
        }
        setupContracts();
    }, [account, contracts, balance, epoch, stakingStatus]);

    //temp function for testing
    const insertReward = async () => {
        if (globalContracts && airdropAccount) {
            try {
                const tx = await globalContracts.trustStaking.insertAirdropRewards(accountToBeRewarded, rewardTemp);
                console.log("Insert Successful", tx);
                setReward(rewardTemp);
            } catch (error) {
                console.log(error);
            }
        }};

    const claim = async () => {
        if (globalContracts && airdropAccount) {
            try {
                const tx = await globalContracts.trustStaking.airdrop(account);
                setRemainingRewards((await globalContracts.trustStaking.getTotalTrustReward(Number(airdropEpoch))).toString());
                console.log("Claim Successful", tx);
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
            <h4>Current TRUST Epoch: {airdropEpoch ? airdropEpoch : "Loading"}</h4>
            <h4>Staking status: {allowStaking != null ? allowStaking.toString() : "Loading"}</h4>
            <h4>Your airdrop: {reward}</h4>
            <h4>Remaining airdrop for epoch: {remainingRewards}</h4>
            {allowStaking == "false" ?
            <>
                {/* Need type checking here */}
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