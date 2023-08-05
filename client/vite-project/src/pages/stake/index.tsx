import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

//@ts-ignore
export default function Stake({account , contracts, balance, epoch, stakingStatus}){
    const admin = "0x8066221588691155A7594291273F417fa4de3CAe"
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
        <div className="flex flex-col items-center p-8 rounded-lg shadow-lg poppins">

            <h3 className="unbounded text-3xl my-5">Stake your $TRUST</h3>
            <p className="text-lg text-center poppins max-w-xl">
            Stake your $TRUST to participate in the next epoch. The countdown to the next epoch will begin once the minimum stake is met.
            </p>
    
            <ul className="mx-auto mt-6 mb-4 text-lg font-medium border rounded-lg bg-gray-700/30 border-gray-600 text-white font-mono">
            <li className="w-full px-8 py-2 border-b border-gray-600">
                Your $TRUST balance:
                <mark className="px-3 py-1 mx-2 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {trustBalance ? trustBalance : "Loading"}
                </mark>
            </li>
            <li className="w-full px-8 py-2 border-b border-gray-600">
                Staking for next Epoch:
                <mark className="px-3 py-1 mx-2 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {epoch ? Number(epoch) + 1 : "Loading"}
                </mark>
            </li>
            <li className="w-full px-8 py-2 border-b border-gray-600">
                Staking status:
                <mark className="px-3 py-1 mx-2 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {allowStaking != null ? allowStaking.toString() : "Loading"}
                </mark>
            </li>
            <li className="w-full px-8 py-2 border-b border-gray-600">
                Threshold to begin epoch:
                <mark className="px-3 py-1 mx-2 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {minStake ? minStake : "Loading"}
                </mark>
            </li>
            <li className="w-full px-8 py-2">
                Total staked:
                <mark className="px-3 py-1 mx-2 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {totalStaked ? totalStaked : "Loading"}
                </mark>
            </li>
            </ul>
    
            {allowStaking === "true" ? (
                approved ? (
                    <div className="flex mt-4 h-12 items-center rounded-lg bg-opacity-50 backdrop-filter backdrop-blur-md  focus:outline-none transition-all duration-100">
                    <input
                    type="text"
                    value={stakeAmount}
                    onChange={handleInputChange}
                    placeholder="Stake amount..."
                    className="border border-slate-700 w-full h-full flex-1 px-4 py-full bg-gray-900 hover:border-white transition-all duration-100 rounded-l-lg bg-transparent border border-transparent group focus:border-transparent focus:outline-none"
                    />

                    <span className="relative inline-flex h-full">
                        <button
                        onClick={stake}
                        className="relative h-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-r-lg group bg-gradient-to-br from-purple-600 to-blue-500 dark:text-white shadow-lg shadow-purple-800/40 dark:shadow-lg dark:shadow-purple-800/40"
                        >
                        <span className="relative h-full px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 dark:bg-slate-900 rounded-r-md group-hover:bg-opacity-0">
                            Stake
                        </span>
                        </button>
                    </span>
                    </div>
                ) : (
                    <span className="relative inline-flex">
                    <button
                        onClick={approve}
                        className="mt-4 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg 
                        group bg-gradient-to-br from-purple-600 to-blue-500 dark:text-white shadow-lg shadow-purple-800/40 dark:shadow-lg dark:shadow-purple-800/40"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 dark:bg-slate-900 rounded-md group-hover:bg-opacity-0">
                        Approve
                        </span>
                    </button>
                    </span>
                )
                ) : (
                <>
                    <h2 className="mt-4 text-lg">
                    Min stake met and epoch {Number(epoch) + 1} will begin soon – go claim your reward for this epoch if you haven't already!
                    </h2>
                    {account === admin ? (
                    <span className="relative inline-flex">
                        <button
                        onClick={handleEpochStart}
                        className="mt-4 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg 
                        group bg-gradient-to-br from-purple-600 to-blue-500 dark:text-white shadow-lg shadow-purple-800/40 dark:shadow-lg dark:shadow-purple-800/40"
                        >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 dark:bg-slate-900 rounded-md group-hover:bg-opacity-0">
                            Start next epoch
                        </span>
                        </button>
                    </span>
                    ) : null}
                </>
                )}
      </div>
    ) 
}