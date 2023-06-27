import express, { Request, Response } from 'express';
import DefiDataModel from '../models/DefiData';


const router = express.Router()

/**
 * Adds defi data to the backend
 */
router.get("/", async (req: Request, res: Response) => {
    console.log("Getting defi data")
    try{
        const defiData = await DefiDataModel.find({})
        res.json(defiData)
        // const { name } = req.body;
        // const regex = new RegExp(`^${name}$`, 'i'); // Case-insensitive RegExp
        // const dataExists = await DefiDataModel.exists({ name: regex });

        // if (dataExists){
        //     console.log("Data exists alrady")
        //     res.status(409).json({ message: 'Data already exists' });
        //     return
        // }

        // console.log("Request body",req.body)

        // // Create and save new data
        // const newData = new DefiDataModel(req.body);
        // console.log("Before save new data:", newData)
        // await newData.save();
        // console.log("save successful")
        // res.json(newData);
    }catch (err){
        console.log("There is an error")
        res.json(err)
    }
    
});


module.exports = router
