//@ts-ignore
import { Signer, ethers } from "ethers";
import { getProvider, getContract } from '../utils/ethers';

type TransactionResponse = {
    status : true, 
    thirdWebAddr : string
    contracts : {
        trust: ethers.Contract;
        trustStaking: ethers.Contract;
        trustStakingHelper: ethers.Contract;
    }

} | {
    status : false,
    message : string
}

export default class ThirdWebAuth{

    address : string 
    signer : ethers.Signer 
    provider : any
    
    constructor(address : string, thirdWebSigner : Signer, provider : any){
        this.address = address
        this.signer = thirdWebSigner
        this.provider = provider
    }

    async authorizeTransaction(
        minTransactions : number = 10,
        minEthBalance : number = 10
        ) : Promise<TransactionResponse>{
        
        let transactionCount = await this.provider.getTransactionCount(this.address)
        transactionCount = Number(transactionCount.toString())
        let ethBalance = (await this.provider.getBalance(this.address)).toString();

        if (ethBalance >= minEthBalance && transactionCount >= minTransactions){
            let contract = await getContract(this.signer)
            return {
                status : true,
                thirdWebAddr : this.address,
                contracts : contract
            }
        }
        return {status : false, message : "Wallet does not meet requirements"}
    }

    static async getProvider(){
        return await getProvider()
    }
}