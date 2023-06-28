import express, { Request, Response } from 'express';
import DisputeModel from '../models/Disputes';


const router = express.Router()

/**
 * Get disputes from mongo db and post it to frontend
 */
router.get("/", async (req: Request, res: Response) => {
    try{
        const disputes = await DisputeModel.find({})
        res.json(disputes)
    }catch(err){
        res.json(err)
    }
    
});



/**
 * Adds dispute from frontend and puts it to mongodb
 * Requires frontend to handle invalid averages
 */
router.post("/", async (req: Request, res: Response) => {
    try{
        let dispute = req.body;
        const newDispute = new DisputeModel(dispute);
        await newDispute.save();
        res.json(dispute);
    }catch(error){
        // Need to figure out how to handle on the frontend
        res.status(500).json({ message: "An error occurred." });
    }
    
});


module.exports = router