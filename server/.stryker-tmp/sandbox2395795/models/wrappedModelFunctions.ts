// @ts-nocheck
import { Model } from "mongoose";


async function wrappedFindOne(dataModel : Model<any>, query : object) : Promise<object>{
    let response = await dataModel.findOne( {protocolName : "Coinbase Wrapped Staked ETH"})
    if (response == null){
        throw new Error("Query not found")
    }
    return response
}


export {wrappedFindOne}