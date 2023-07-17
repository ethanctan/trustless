import express, { Request, Response } from 'express';
import DefiDataModel from '../models/DefiData';


const router = express.Router()

/** 
 * Returns defi data
 * TODO Improve efficiency
 */
router.get("/", async (req: Request, res: Response) => {
    console.log(typeof res.json);
    try{
        const defiData = await DefiDataModel.find({})
        res.json(defiData)
    }catch (err){
        res.json(err)
    }
    
});

/**
 * Add defi data to the userbase
 */
// router.post("/", async (req : Request, res : Response) => {
//     const { name } = req.body;
//     const regex = new RegExp(`^${name}$`, 'i'); // Case-insensitive RegExp 

//     const dataExists = await DefiDataModel.exists({ protocolName: regex });

//     if (dataExists) {
//         res.status(409).json({ message: 'Data already exists' });
//         return
//     }  

//     console.log("Saving stuff")
//     // Create and save new data
//     const newData = new DefiDataModel(req.body);
//     await newData.save();
//     res.json(newData);
    
// });


module.exports = router
