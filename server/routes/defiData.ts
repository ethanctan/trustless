/**
 * All routes under /defiData
 * @module DefiData 
 */
import express, { Request, Response } from 'express';
import DefiDataModel from '../models/DefiData';


const router = express.Router()

/** 
 * Gets all Defi data from database. 
 * @returns a list of the form [{_id, name, logo}] all of type string
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
