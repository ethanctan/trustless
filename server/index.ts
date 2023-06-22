import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import DisputeModel from './models/Disputes';
import UserModel from './models/Users';
import ProtocolModel from './models/Protocols';

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://dyang:RrrwmSWGDb1vqNZy@cluster0.vtkcvkm.mongodb.net/disputeboard?retryWrites=true&w=majority");

/**
 * Get disputes from mongo db and post it to frontend
 */
app.get("/getDisputes", (req: Request, res: Response) => {
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
app.post("/addDispute", async (req: Request, res: Response) => {
    console.log(req.body) 
    const dispute = req.body;

    // TODO: Check for duplicate keys
    let addressFromCorrect = validHex(dispute["addressFrom"]);
    let addressToCorrect = validHex(dispute["addressTo"]);
    let txnHashCorrect = dispute["txnHash"];
    let blockIdCorrect = (dispute["blockID"] != -1);

    if (!(addressFromCorrect && addressToCorrect && txnHashCorrect && blockIdCorrect)){
        res.json({error: "Invalid input"})
        return
    }

    // update protocol db - need to create unique index?
    await ProtocolModel.updateOne(
        {protocolAddress: dispute["addressTo"]}, 
        {$inc:{disputeCount: 1}},
        {upsert: true}
    );

    const newDispute = new DisputeModel(dispute);
    await newDispute.save();

    res.json(dispute);
});

const HEXREGEX = /^0x[0-9A-F]/g
function validHex(str: string){
    str = str.toLocaleLowerCase()
    return str.match(HEXREGEX)
}

/**
 * Get a list of users
 */
app.get("/getUsers", (req: Request, res: Response) => {
    UserModel.find({})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json(err);
    });
});

/**
 * Add user to mongodb
 */
app.post("/addUser", async (req: Request, res: Response) => {
    const user = req.body;
    const newUser = new UserModel(user);
    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch(err) {
        res.status(400).json(err);
    }
});

app.listen(3001, () => {
    console.log('server running on port 3001');
});
