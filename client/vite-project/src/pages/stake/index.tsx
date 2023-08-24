import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import pendingCheck from '../../components/pendingCheck';

import { useNetworkMismatch } from "@thirdweb-dev/react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

//@ts-ignore
export default function Stake({account , contracts, balance, epoch, provider, passPendingState}){
    const admin = "0x8066221588691155A7594291273F417fa4de3CAe"
    const [stakeAccount, setStakeAccount] = useState(""); // retrieve global address variable
    const [globalContracts, setGlobalContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract, trustStakingHelper: ethers.Contract} | null>(null); // retrieve global contracts variable
    const [trustBalance, setTrustBalance] = useState ("");

    const [approved, setApproved] = useState(false);
    const [stakeAmount, setStakeAmount] = useState(0);
    const [totalStaked, setTotalStaked] = useState("");
    const [minStake, setMinStake] = useState("");
    const [totalStakedByUser, setTotalStakedByUser] = useState(""); 

    //thirdWeb hooks
    const isMismatched = useNetworkMismatch();
    const switchChain = useSwitchChain();

    useEffect(() => {
        async function setupContracts() {
            setStakeAccount(account);
            setGlobalContracts(contracts);
            setTrustBalance(balance);
            setTotalStakedByUser((await contracts.trustStakingHelper.viewStake()).toString());
            setTotalStaked((await contracts.trust.balanceOf(contracts.trustStakingHelper.address)).toString());
            setMinStake((await contracts.trustStakingHelper.minStake()).toString());
            console.log("Done")
        }
        setupContracts();
    }, [account, contracts, balance, epoch]);

    const switchNetwork = async () => {
        if (isMismatched) {
          console.log("Network mismatched")
          switchChain(Sepolia.chainId);
        }
      };

    const approve = async () => {
        if (globalContracts && stakeAccount) {
            try {
                passPendingState(true);
                const tx = await globalContracts.trust.approve(globalContracts.trustStakingHelper.address, 100000000000)
                //wait for transaction to finish mining
                await pendingCheck({txHash: tx.hash, provider: provider})
                //update paramters
                passPendingState(false)
                setApproved(true);
            } catch (error) {
                console.log(error);
            }
        }};

    const stake = async () => {
        if (globalContracts && stakeAccount) {
            try {
                passPendingState(true);
                const tx = await globalContracts.trustStakingHelper.stake(stakeAmount);
                //wait for transaction to finish mining
                await pendingCheck({txHash: tx.hash, provider: provider})
                //update params
                passPendingState(false)
                setTotalStaked((await contracts.trust.balanceOf(contracts.trustStakingHelper.address)).toString());
                setTrustBalance((await contracts.trust.balanceOf(stakeAccount)).toString());
                setMinStake((await contracts.trustStakingHelper.minStake()).toString());
                setTotalStakedByUser((await contracts.trustStakingHelper.viewStake()).toString());
            } catch (error) {
                console.log(error);
            }
        }};

    const handleInputChange = (event : any) => {
        setStakeAmount(event.target.value);
    }

    const unstake = async () => {
        if (globalContracts && stakeAccount) {
            try {
                passPendingState(true);
                const tx = await globalContracts.trustStakingHelper.withdraw();
                //wait for transaction to finish mining
                await pendingCheck({txHash: tx.hash, provider: provider})
                //set params
                passPendingState(false)
                setTotalStaked((await contracts.trust.balanceOf(contracts.trustStakingHelper.address)).toString());
                setTotalStakedByUser((await contracts.trustStakingHelper.viewStake()).toString());
                setTrustBalance((await contracts.trust.balanceOf(stakeAccount)).toString());
            } catch (error) {
                console.log(error);
            }
        }};

    const handleEpochStart = async () => {
        if (globalContracts && stakeAccount) {
            try {
                passPendingState(true)
                const tx = await globalContracts.trustStakingHelper.transferStake();
                //wait for transaction to finish mining
                await pendingCheck({txHash: tx.hash, provider: provider})
                //print done
                console.log("New epoch started")
                passPendingState(false)
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="flex flex-col items-center md:p-8 rounded-lg shadow-lg poppins">

            <h3 className="unbounded text-3xl my-5">Stake your $TRUST</h3>
            <p className="text-lg text-center poppins max-w-xl">
            Stake your $TRUST to participate in the next epoch. The countdown to the next epoch will begin once the minimum stake is met. 
            </p>
            <p className="text-lg text-center poppins max-w-xl mt-4">
            Note that <a className="underline"> once an epoch begins, you will not be able to unstake. </a> Instead, your staked $TRUST will be doubled by the treasury, put into the epoch's $TRUST pool, and the $TRUST pool will be airdropped as new rewards based on your performance in this epoch.
            </p>
    
            <ul className="mx-auto mt-6 mb-4 text-lg font-medium border rounded-lg bg-gray-700/30 border-gray-600  text-zinc-300 font-mono">
            <li className="w-full px-8 py-2 border-b border-gray-600">
                Your $TRUST balance:
                <mark className="px-3 py-1 mx-2  text-zinc-300 bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {trustBalance ? trustBalance : "Loading"}
                </mark>
            </li>
            <li className="w-full px-8 py-2 border-b border-gray-600">
                You will stake for epoch #:
                <mark className="px-3 py-1 mx-2  text-zinc-300 bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {epoch ? Number(epoch) + 1 : "Loading"}
                </mark>
            </li>
            <li className="w-full px-8 py-2 border-b border-gray-600">
                Threshold to begin the epoch:
                <mark className="px-3 py-1 mx-2  text-zinc-300 bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {minStake ? minStake : "Loading"}
                </mark>
            </li>
            <li className="w-full px-8 py-2 border-b border-gray-600">
                Your total staked $TRUST:
                <mark className="px-3 py-1 mx-2  text-zinc-300 bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {totalStakedByUser ? totalStakedByUser : "Loading"}
                </mark>
            </li>
            <li className="w-full px-8 py-2">
                Overall total staked $TRUST:
                <mark className="px-3 py-1 mx-2  text-zinc-300 bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                {totalStaked ? totalStaked : "Loading"}
                </mark>
            </li>
            </ul>

            {isMismatched ? (
                <button
                onClick={switchNetwork} 
                className="relative h-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-red-600 to-orange-300  text-zinc-300 shadow-lg shadow-purple-800/40"
                >
                <span className="relative h-full px-5 py-3 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0">
                    Please switch your network.
                </span>
                </button>
            ) :
            <>
            {approved ? (
                    <div className="flex mt-4 h-12 items-center rounded-lg bg-opacity-50 backdrop-filter backdrop-blur-md  focus:outline-none transition-all duration-100">
                    <input
                    type="text"
                    value={stakeAmount}
                    onChange={handleInputChange}
                    placeholder="Stake amount..."
                    className="border-slate-500 border-2 w-full h-full flex-1 px-4 py-full bg-gray-900 hover:border-white transition-all duration-100 rounded-l-lg bg-transparent border border-transparent group"
                    />

                    <span className="relative inline-flex h-full">
                        <button
                        onClick={stake}
                        className="relative h-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-r-lg group bg-gradient-to-br from-purple-600 to-blue-500  text-zinc-300 shadow-lg shadow-purple-800/40"
                        >
                        <span className="relative h-full px-5 py-3 transition-all ease-in duration-75 bg-slate-900 rounded-r-md group-hover:bg-opacity-0">
                            Stake
                        </span>
                        </button>
                    </span>
                    </div>
                ) : (
                    <span className="relative inline-flex">
                    <button
                        onClick={approve}
                        className="mt-4 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg 
                        group bg-gradient-to-br from-purple-600 to-blue-500  text-zinc-300 shadow-lg shadow-purple-800/40"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0">
                        Approve $TRUST to stake!
                        </span>
                    </button>
                    </span>
                )}

                { Number(totalStakedByUser) > 0 ?
                    <div className="flex mt-4 h-12 items-center rounded-lg bg-opacity-50 backdrop-filter backdrop-blur-md  focus:outline-none transition-all duration-100">

                    <span className="relative inline-flex h-full">
                        <button
                        onClick={unstake} 
                        className="relative h-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500  text-zinc-300 shadow-lg shadow-purple-800/40"
                        >
                        <span className="relative h-full px-5 py-3 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0">
                            Unstake
                        </span>
                        </button>
                    </span>
                    </div> : null
                }

                { account == admin ?
                    <button onClick={handleEpochStart}>
                        Transfer Stake and start staking for new epoch
                    </button> 
                    : null}
            </> }
      </div>
    ) 
}