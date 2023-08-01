/**
 * All routes under /epochCount
 * @module EpochCount
 */
import express, { Request, Response, response } from 'express';
import EpochCountModel from '../models/EpochCount';
const router = express.Router()

/** 
 * Gets epochCount from database. 
 * @returns a singular data point in form [{_id, number }] 
 */
router.get("/", async (req: Request, res: Response) => {
    try{
        const epochCount = await EpochCountModel.find({})
        res.json(epochCount)
    }catch (err){
        res.json(err)
    }
    
});

module.exports = router