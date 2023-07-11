import { Model } from "mongoose";


async function wrappedFindOne(dataModel : Model<any>, query : object) : Promise<object>{
    console.log("query", query)
    let response = await dataModel.findOne( {protocolName : "Coinbase Wrapped Staked ETH"})
    console.log("Data model", dataModel)
    if (response == null){
        throw new Error("Query not found")
    }
    return response
}


export {wrappedFindOne}