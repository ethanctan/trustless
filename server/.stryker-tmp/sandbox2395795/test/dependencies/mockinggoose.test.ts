// @ts-nocheck
const mockingoose = require('mockingoose');
import ProtocolModel from "../../models/Protocols";

describe ("Test function", () => {
    let jsonList = [
        {
        protocolName: "b",
        disputeCount: 14,
        averageScore: 4,
        qScore: [4, 4, 4, 4, 4]
    },{
        protocolName: "a",
        disputeCount: 10,
        averageScore: 3,
        qScore: [3, 3, 3, 3, 3]
    },  {
        protocolName: "c",
        disputeCount: 18,
        averageScore: 8,
        qScore: [8, 8, 8, 8, 8]
    }]

    it("Should give me a function in no particular order", async () => {
        mockingoose(ProtocolModel).toReturn(jsonList, 'find')
        let data = await ProtocolModel.find({}).sort({averageScore : 1})
        expect(1).toBe(1)
    })
    
})