import express, { Request, Response } from 'express';
import DisputeModel from '../models/Disputes';


const router = express.Router()

/**
 * Get disputes from mongo db and post it to frontend
 */
router.get("/", (req: Request, res: Response) => {
    DisputeModel.find({})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json(err);
    });
});



/**
 * Adds dispute from frontend and puts it to mongodb
 */
router.post("/", async (req: Request, res: Response) => {
    try{
        const dispute = req.body;
        if (!(checkScoresCorrect(dispute["qVals"]))){
            console.log("Invalid input: averages are too big")
            res.json({error: "Invalid input"})
            return
        }
        
        const newDispute = new DisputeModel(dispute);
        await newDispute.save();

        res.json(dispute);
    }catch(error){
        // Need to figure out how to handle on the frontend
        res.status(500).json({ message: "An error occurred." });
    }
    
});


function checkScoresCorrect(dispute : [number]){
    for (let i=0; i < dispute.length; i++){
        if (dispute[i] > 10 || dispute[i] < 1){
            return false
        }
    }
    return true
}


module.exports = router