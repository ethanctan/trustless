import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

//@ts-ignore
export default function Stake({account , contracts, balance, epoch, stakingStatus}){
    const admin = "0x965c78d9532479fd57bebe3140cc681d5a11df89"
    const [stakeAccount, setStakeAccount] = useState(""); // retrieve global address variable
    const [globalContracts, setGlobalContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract, trustStakingHelper: ethers.Contract} | null>(null); // retrieve global contracts variable
    const [trustBalance, setTrustBalance] = useState ("");
    const [allowStaking, setAllowStaking] = useState(""); 

    const [approved, setApproved] = useState(false);
    const [stakeAmount, setStakeAmount] = useState(0);
    const [totalStaked, setTotalStaked] = useState("");
    const [minStake, setMinStake] = useState("");

    useEffect(() => {
        async function setupContracts() {
            setStakeAccount(account);
            setGlobalContracts(contracts);
            setTrustBalance(balance);
            setAllowStaking(stakingStatus);
            setTotalStaked((await contracts.trust.balanceOf(contracts.trustStakingHelper.address)).toString());
            setMinStake((await contracts.trustStakingHelper.minStake()).toString());
            console.log("Done")
        }
        setupContracts();
    }, [account, contracts, balance, epoch, stakingStatus]);

    const approve = async () => {
        if (globalContracts && stakeAccount) {
            try {
                const tx = await globalContracts.trust.approve(globalContracts.trustStakingHelper.address, 100000000000)
                console.log("Approve Successful", tx);
                setApproved(true);
            } catch (error) {
                console.log(error);
            }
        }};

    const stake = async () => {
        if (globalContracts && stakeAccount) {
            try {
                const tx = await globalContracts.trustStakingHelper.stake(stakeAmount);
                setTotalStaked((await contracts.trust.balanceOf(contracts.trustStakingHelper.address)).toString());
                //update params
                setTrustBalance((await contracts.trust.balanceOf(stakeAccount)).toString());
                setAllowStaking((await globalContracts.trustStakingHelper.canStake()).toString());
                setMinStake((await contracts.trustStakingHelper.minStake()).toString());
                console.log("Staking Successful", tx);
            } catch (error) {
                console.log(error);
            }
        }};

    const handleInputChange = (event : any) => {
        setStakeAmount(event.target.value);
    }

    const handleEpochStart = async () => {
        if (globalContracts && stakeAccount) {
            try {
                const tx = await globalContracts.trustStakingHelper.openStaking();
                console.log("Epoch Start Successful", tx);
                setAllowStaking((await globalContracts.trustStakingHelper.canStake()).toString());
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1>This is the staking page</h1>
            <h4>Your TRUST balance: {trustBalance ? trustBalance : "Loading"}</h4>
            <h4>Staking for next Epoch: {epoch ? Number(epoch)+1 : "Loading"}</h4>
            <h4>Staking status: {allowStaking != null ? allowStaking.toString() : "Loading"}</h4>
            <h4>Minimum stake for Epoch: {minStake ? minStake : "Loading"}</h4>
            <h4>Total staked: {totalStaked ? totalStaked : "Loading"}</h4>

            {allowStaking == "true" ? 
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
                        Stake for next epoch
                    </button>
                    </> : 
                    <button 
                        onClick={approve} 
                        style={{backgroundColor: 'blue', color: 'white', padding: '10px 20px'}}
                    >
                        Approve
                    </button>
                :
                <>
                <h2> Min stake met and epoch {Number(epoch)+1} will begin soon – go claim your reward for this epoch if you haven't already!</h2>
                { account == admin ? <button onClick={handleEpochStart}> Start next epoch </button> : null}
                </>
            }
        </div>
    ) 
}