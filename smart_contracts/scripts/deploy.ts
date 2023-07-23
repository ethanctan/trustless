import {ethers} from 'hardhat';
import { ITRUSTStaking } from '../interfaces/TRUSTStaking';
import { ITRUST } from '../interfaces/TRUST';
import { Contract } from 'ethers';
import { encodeConstructorParamsForImplementation } from '@thirdweb-dev/sdk';

async function main() {

    console.log('Running deployment script...');
    try{
        let trust: Contract;
        let owner;
        let addr1;
        let addrs;
        let trustStaking: Contract;

        [owner, addr1, ...addrs] = await ethers.getSigners();
        console.log('Signers obtained');

        await ethers.getContractFactory("TRUST");
        console.log('Contract factory for TRUST obtained');

        trust = await ethers.deployContract('TRUST') as unknown as (Contract & ITRUST);
        await trust.waitForDeployment();
        let trustAddress = await trust.getAddress()
        console.log('TRUST contract deployed at', trustAddress);
        console.log('Airdrop Reserve:', (await trust.airdropReserve()).toString());
        console.log('Owner address:', owner.address);
        console.log('Initial TRUST Balance of admin account:', await trust.balanceOf(owner.address));

        let minStakeIncrement = 10000; 
        let rewardMultiplier = 10; 
        let trustDAO = addr1.address; 

        // Deploy TRUSTStaking contract -- default contract call is owner
        await ethers.getContractFactory("TRUSTStaking");
        console.log('Contract factory for TRUSTStaking obtained');

        trustStaking = await ethers.deployContract('TRUSTStaking', [trust, minStakeIncrement, rewardMultiplier, trustDAO]) as unknown as (Contract & ITRUSTStaking);
        await trustStaking.waitForDeployment();
        let trustStakingAddress = await trustStaking.getAddress()
        console.log('TRUSTStaking contract deployed at', trustStakingAddress);

        // Set the staking address in TRUST contract
        ((await trust.connect(owner)) as unknown as (Contract & ITRUST)).setStakingAddress(trustStakingAddress);
        console.log('Staking address set for TRUST contract');

        console.log('Staking address, giving time:', (await trust.stakingAddress()).toString());
        console.log('Staking address:', (await trust.stakingAddress()).toString());
        console.log('TRUST token balance of staking contract test:', await trust.balanceOf(trustStakingAddress));
        console.log('TRUST Balance of admin account after setStakingAddress:', await trust.balanceOf(owner.address));

        // Confirm deposit
        try {
            ((await trustStaking.connect(owner)) as unknown as (Contract & ITRUSTStaking)).confirmDeposit();
            console.log('Deposit confirmed')
        }catch (error) {
            console.log('Deposit not confirmed');
        }

        console.log("Epoch Count", await trustStaking.epochCount());
        console.log("Total Reward for Epoch", await trustStaking.getTotalTrustReward(0));

    } catch (error) {
        console.error(error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });