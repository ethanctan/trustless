import express, { Request, Response } from 'express';
import DefiDataModel from '../models/DefiData';


const router = express.Router()


router.get("/", (req: Request, res: Response) => {
    DefiDataModel.find({})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json(err);
    });
});


module.exports = router
