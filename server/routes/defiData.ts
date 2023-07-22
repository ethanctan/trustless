import express, { Request, Response } from 'express';
import DefiDataModel from '../models/DefiData';


const router = express.Router()

/** 
 * Gets all Defi data from database
 */
router.get("/", async (req: Request, res: Response) => {
    try{
        const defiData = await DefiDataModel.find({})
        res.json(defiData)
    }catch (err){
        res.json(err)
    }
    
});



module.exports = router
