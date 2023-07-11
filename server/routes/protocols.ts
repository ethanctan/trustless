import express, { Request, Response, response } from 'express';
import ProtocolModel from '../models/Protocols';
import { wrappedFindOne } from '../models/wrappedModelFunctions';
const router = express.Router()

enum Order{
    Ascending = 1,
    Descending = -1
} 

router.get("/", async (req: Request, res: Response) => {
    let order = Order.Descending
    if (req.query && req.query.order == 'ascending'){
        order = Order.Ascending
    }

    try{
        // what if protocolModel returns null?
        const test = await ProtocolModel.find({}).sort({averageScore : order})
        let responseData = test.map(result => ({
            protocolName: result["protocolName"],
            disputeCount: result["disputeCount"],
            averageScore: result["averageScore"]
        }))

        res.status(200).json(responseData)
    }catch(error){
        res.status(400).json(error) 
    }
});

/**
 * Adds protocol data to the db if it hasn't been added already
 * Requires frontend to handle valid averages 
 */
router.post("/", async (req: Request, res: Response) => {
    const protocol = req.body;
    try {
        let doc = await ProtocolModel.findOne(
            {protocolName: protocol["protocolName"]},
        )

        if (doc == null){
            const newProtocol = new ProtocolModel(protocol);
            newProtocol.save();
            res.json(protocol)
            return
        }
        doc = updateDoc(doc, protocol)
        //@ts-ignore
        doc.save()

        res.json(protocol);
    } catch (error) {
         // should handle this error
        res.status(500).json({ message: "An error occurred." });
    }
});


const updateAvg = (docScores : number[], protocolScores : number[], 
    numDisputes : number) : [number[], number]=> {
    var newQScores = [0, 0, 0, 0, 0]
    // element-wise sum on old q scores and incoming scores
    newQScores =  protocolScores.map(function (num : number, idx : number) {
        return num + docScores[idx];
    })
    // use updated q scores to recompute average
    let newAvg = (newQScores.reduce(
        (partialSum : number, a: number) => 
        partialSum + a, 0))/((numDisputes+1)*5)

    return [newQScores, newAvg]
}

/**
 * Updates document based on new q score
 */
const updateDoc = (doc : any, protocol : object) => {
    let [newQScores, newAvg] = updateAvg(
        doc["qScores"], protocol["qScores"], doc["disputeCount"]
    )

    doc["disputeCount"] += 1
    doc["protocolName"] = protocol["protocolName"]
    doc["averageScore"] = newAvg
    doc["qScores"] = newQScores
    return doc
}

module.exports.router = router
module.exports.testFxns = { updateAvg, updateDoc}
