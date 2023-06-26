import express, { Request, Response } from 'express';
import ProtocolModel from '../models/Protocols';

const router = express.Router()

enum Order{
    Ascending = 1,
    Descending = -1
}

router.get("/", async (req: Request, res: Response) => {
    console.log("Req query: ",req.query)
    let order = Order.Descending
    if (req.query.order == 'ascending'){
        order = Order.Ascending
    }

    ProtocolModel.find({})
    //@ts-ignore
    .sort({ averageScore: order })
    .then(results => {
        let responseData = results.map(result => ({
            protocolName: result["protocolName"],
            disputeCount: result["disputeCount"],
            averageScore: result["averageScore"]
        }));
        res.json(responseData);
    })
    .catch(err => {
        res.json(err);
    });
});





router.post("/", async (req: Request, res: Response) => {
    try {
        const protocol = req.body;
        if (!checkScoresCorrect(protocol["qScores"])){
            res.json({error:"Invalid input"});
            return
        }
        await ProtocolModel.findOne(
            {protocolName: protocol["protocolName"]},
        ).then((doc : any)=>{
            // Check if doc is null
            if (!doc){
                const newProtocol = new ProtocolModel(protocol);
                newProtocol.save();
                return
            }

            updateDoc(doc, protocol)
        })

        res.json(protocol);
    } catch (error) {
         // should handle this error
        res.status(500).json({ message: "An error occurred." });
    }
});

/**
 * Updates document based on new q score
 */
function updateDoc(doc : any, protocol : object){
    var newQScores = [0, 0, 0, 0, 0]
    // element-wise sum on old q scores and incoming scores
    newQScores =  protocol["qScores"].map(function (num : number, idx : number) {
        return num + doc["qScores"][idx];
    })
    // use updated q scores to recompute average
    let newAvg = (newQScores.reduce(
        (partialSum : number, a: number) => 
        partialSum + a, 0))/((doc["disputeCount"])*5)

    doc["disputeCount"] += 1
    doc["protocolName"] = protocol["protocolName"]
    doc["averageScore"] = newAvg
    doc["qScores"] = newQScores
    doc.save()
}

function checkScoresCorrect(dispute : [number]){
    for (let i=0; i < dispute.length; i++){
        if (dispute[i] > 10 || dispute[i] < 1){
            return false
        }
    }
    return true
}

module.exports = router