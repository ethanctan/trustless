import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import pendingCheck from '../../components/pendingCheck';

//@ts-ignore
export default function Airdrop({account , contracts, balance, epoch, provider, passPendingState}){
    const admin = "0x8066221588691155A7594291273F417fa4de3CAe"
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
                passPendingState(true)
                const tx = await globalContracts.trustStaking.insertAirdrop(accountToBeRewarded, rewardTemp, Number(epoch));
                //wait for transaction to finish mining
                await pendingCheck({txHash: tx.hash, provider: provider})
                //update paramters
                passPendingState(false)
                setReward((await contracts.trustStaking.viewAirdrop(Number(epoch))).toString());
            } catch (error) {
                console.log(error);
            }
        }};

    const claim = async () => {
        if (globalContracts && airdropAccount) {
            try {
                passPendingState(true)
                const tx = await globalContracts.trustStaking.claimAirdrop(Number(epoch));
                //wait for transaction to finish mining
                await pendingCheck({txHash: tx.hash, provider: provider})
                //update paramters
                passPendingState(false)
                setReward((await contracts.trustStaking.viewAirdrop(Number(epoch))).toString());
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
        <div className="flex flex-col poppins">

            <h3 className="unbounded text-3xl my-5">
                Claim your $TRUST
            </h3>

            <div className="poppins max-w-xl text-lg pb-1 rounded-b-lg duration-300 md:px-10 mb-5">
                After every epoch you've participated in, you can claim a $TRUST airdrop. The more ratings you submit, and the closer each rating is to the eventual average score, the more $TRUST you'll earn.
            </div>

            <ul className="mx-auto text-lg font-medium border rounded-lg bg-gray-700/30 border-gray-600 text-white font-mono">
                <li className="w-full px-8 py-2 border-b rounded-t-lg border-gray-600">
                    Your $TRUST balance: 
                    <mark className="px-3 py-1 mx-2 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                        {trustBalance ? trustBalance : "Loading"}
                    </mark> 
                </li>
                <li className="w-full px-8 py-2 border-b border-gray-600">
                    Current TRUSTLESS Epoch: 
                    <mark className="px-3 py-1 mx-2 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                        {epoch ? epoch : "Loading"}
                    </mark>
                </li>
                <li className="w-full px-8 py-2 rounded-b-lg">
                    Your airdrop: 
                    <mark className="px-3 py-1 mx-2 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md">
                        {reward}
                    </mark>
                </li>
            </ul>

                
                {Number(reward) > 0 ? 
                <button
                    className="mx-auto mt-8 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg 
                    group bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-800/40"
                    onClick={claim}
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0">
                    Claim Airdrop!
                    </span>
                </button>
                : 
                <p className="text-lg mt-4 w-full px-8 py-2 rounded-b-lg">            
                    No airdrop. Rate protocols in the next epoch! 
                </p>
                }

            { account === admin ?
            <>
            <h4> Master Console to insert rewards</h4>
                <input 
                        type="text" 
                        value={rewardTemp} 
                        onChange={handleRewardChange} 
                        className="text-black m-10"
                    />
                <input 
                        type="text" 
                        value={accountToBeRewarded} 
                        onChange={handleAccountChange} 
                        className="text-black m-10"
                    />
                <button 
                        onClick={insertReward} 
                        style={{backgroundColor: 'blue', color: 'white', padding: '10px 20px'}}
                    >
                        Insert Reward
                </button>
            </> : null}
            </div>
    ) 
}