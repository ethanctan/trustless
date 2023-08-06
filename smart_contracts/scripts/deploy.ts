import {ethers} from 'hardhat';
import { ITRUSTStakingHelper } from '../interfaces/TRUSTStakingHelper';
import { ITRUSTStaking } from '../interfaces/TRUSTStaking';
import { ITRUST } from '../interfaces/TRUST';
import { Contract } from 'ethers';

async function main() {

    console.log('Running deployment script...');
    try{
        let trust: Contract;
        let trustStaking: Contract;
        let trustStakingHelper: Contract;
        let signer;

        [signer] = await ethers.getSigners();
        console.log('Signers obtained');

        await ethers.getContractFactory("TRUST");
        console.log('Contract factory for TRUST obtained');

        trust = await ethers.deployContract('TRUST') as unknown as (Contract & ITRUST);
        await trust.waitForDeployment();
        let trustAddress = await trust.getAddress()
        console.log('TRUST contract deployed at', trustAddress);
        console.log('Owner address:', signer.address);
        console.log('Initial TRUST Balance of admin account:', await trust.balanceOf(signer.address));

        // Deploy TRUSTStaking contract -- default contract call is owner
        await ethers.getContractFactory("TRUSTStaking");
        console.log('Contract factory for TRUSTStaking obtained');

        trustStaking = await ethers.deployContract('TRUSTStaking', [trust]) as unknown as (Contract & ITRUSTStaking);
        await trustStaking.waitForDeployment();
        let trustStakingAddress = await trustStaking.getAddress()
        console.log('TRUSTStaking contract deployed at', trustStakingAddress);

        // Adding delay
        console.log('Waiting for 10 seconds before proceeding...');
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Set the staking address in TRUST contract
        await ((await trust.connect(signer)) as unknown as (Contract & ITRUST)).setStakingAddress(trustStakingAddress);
        // Wait for 30 seconds
        await new Promise(resolve => setTimeout(resolve, 30000));
        console.log('TRUST token balance of staking contract test:', await trust.balanceOf(trustStakingAddress));
        console.log('TRUST Balance of admin account after setStakingAddress:', await trust.balanceOf(signer.address));

        // Deploy TRUSTStakingHelper contract -- default contract call is owner
        await ethers.getContractFactory("TRUSTStakingHelper");
        console.log('Contract factory for TRUSTStakingHelper obtained');

        trustStakingHelper = await ethers.deployContract('TRUSTStakingHelper', [trust, trustStaking]) as unknown as (Contract & ITRUSTStakingHelper);
        await trustStakingHelper.waitForDeployment();
        let trustStakingHelperAddress = await trustStakingHelper.getAddress()
        console.log('TRUSTStakingHelper contract deployed at', trustStakingHelperAddress);
        console.log("MinStake: ", (await trustStakingHelper.minStake()).toString());

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