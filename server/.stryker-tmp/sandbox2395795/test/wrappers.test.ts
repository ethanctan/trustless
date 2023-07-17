// @ts-nocheck
import { wrappedFindOne } from "../models/wrappedModelFunctions";
import DefiDataModel from "../models/DefiData";
const mockingoose = require('mockingoose');
jest.useFakeTimers();

describe("test wrapped find one",  () =>{
    
        
    test("Find existent value", async () => {
        const dummyData = {
            protocolName : "Coinbase Wrapped Staked ETH", 
            logo : "https://icons.llama.fi/coinbase-wrapped-staked-eth.png"
        }
        mockingoose(DefiDataModel).toReturn(dummyData);
        // let val = await wrappedFindOne(DefiDataModel, {protocolName : "Coinbase Wrapped Staked ETH"})
        let val2 = await DefiDataModel.find( {protocolName : "Coinbase Wrapped Staked ETH"})
        expect(val2["protocolName"]).toBe("Coinbase Wrapped Staked ETH")
    })

    it('should test async', async () => {
        mockingoose(DefiDataModel).toReturn(null)
        await expect(wrappedFindOne(DefiDataModel, {protocolName : "Bye"}))
        .rejects
        .toThrow("Query not found")
    })
    
})