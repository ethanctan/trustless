import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

//@ts-ignore
export default function Stake({account , contracts, balance, epoch, stakingStatus}){

    const [stakeAccount, setStakeAccount] = useState(""); // retrieve global address variable
    const [globalContracts, setGlobalContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract} | null>(null); // retrieve global contracts variable
    const [stakeAmount, setStakeAmount] = useState(0);
    const [trustBalance, setTrustBalance] = useState ("");
    const [stakingEpoch, setEpoch] = useState("");
    const [allowStaking, setAllowStaking] = useState(""); 
    const [approved, setApproved] = useState(false);
    const [totalStaked, setTotalStaked] = useState("");
    const [minStake, setMinStake] = useState("");

    useEffect(() => {
        async function setupContracts() {
            setStakeAccount(account);
            setGlobalContracts(contracts);
            setTrustBalance(balance);
            setEpoch(epoch);
            setAllowStaking(stakingStatus);
            setTotalStaked((await contracts.trustStaking.getTotalStaked(Number(stakingEpoch))).toString());
            setMinStake((await contracts.trustStaking.getMinStake(Number(stakingEpoch))).toString());
            console.log("Done")
        }
        setupContracts();
    }, [account, contracts, balance, epoch, stakingStatus]);

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
                setTotalStaked((await globalContracts.trustStaking.getTotalStaked(Number(stakingEpoch))).toString());
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
            <h4>Current TRUST Epoch: {stakingEpoch ? stakingEpoch : "Loading"}</h4>
            <h4>Staking status: {allowStaking != null ? allowStaking.toString() : "Loading"}</h4>
            <h4>Minimum stake for Epoch: {minStake ? minStake : "Loading"}</h4>
            <h4>Total staked: {totalStaked ? totalStaked : "Loading"}</h4>

            {allowStaking != null && allowStaking == "true" ? 
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
                <h2>Epoch {stakingEpoch} has begun, go to the submit ratings page and submit ratings!</h2>
            }
        </div>
    ) 
}