import express, { Request, Response, response } from 'express';
import ProtocolModel from '../models/Protocols';
const router = express.Router()
import ProtocolController from '../controllers/protocolController';


/**
 * Retrieves protocol data from the database. 
 * @param {string} order - either {ascending, descending}. Specifies order to return data
 */
router.get("/", async (req: Request, res: Response) => {
    let protocolController = new ProtocolController(ProtocolModel)
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
 */
router.post("/", async (req: Request, res: Response) => {
    let protocolController = new ProtocolController(ProtocolModel)
    try {
        let successStatus = await protocolController.addProtocolJson(req.body)
        res.status(201).json(successStatus);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports.router = router
