import express, { Request, Response, response } from 'express';
import ProtocolModel from '../models/Protocols';
const router = express.Router()
import ProtocolController from '../controllers/protocolController';
import UserModel from '../models/user/UserModel';
import mongoose from 'mongoose';


/**
 * Retrieves protocol data from the database. 
 * Returns list in ascending order if req.query = ascending, 
 * in descending otherwise
 * If db is empty then return an empty list
 */
router.get("/", async (req: Request, res: Response) => {
    let protocolController = new ProtocolController(UserModel)
    try{
        let jsonResponse = await protocolController.getProtocolJson(req)
        res.status(200).json(jsonResponse)
    }catch(error){
        res.status(400).json(error) 
    }
});

/**
 * Adds protocol data to the db if it hasn't been added already and updates otherwise
 * @Requires frontend to handle valid averages 
 * @Returns a success message if the db successfully updates 
 * @Returns 500 status if request is null
 * @Returns an error if the request is null
 */
router.post("/", async (req: Request, res: Response) => {
    let protocolController = new ProtocolController(UserModel)
    try {
        let successStatus = await protocolController.getProtocolJson(req)
        res.status(201).json(successStatus);
    } catch (error) {
         // should handle this error
        res.status(500).json({ message: error });
    }
});

module.exports.router = router
