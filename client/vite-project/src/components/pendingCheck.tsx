import { IPendingCheck } from '../utils/components';


export default async function pendingCheck({txHash, provider} : IPendingCheck){
    let receipt = await provider.getTransactionReceipt(txHash);
    while (receipt === null) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        receipt = await provider.getTransactionReceipt(txHash) 
        console.log("checking receipt:", receipt)
    }
    console.log("mining done")
    return receipt
}