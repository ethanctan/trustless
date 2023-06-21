import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import DisputeModel from './models/Disputes';
import UserModel from './models/Users';

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
    console.log("Hello")
    console.log(req.body) 
    

    const dispute = req.body;
    for (let prop in dispute){
        console.log("Checking")
        if (!dispute.hasOwnProperty(prop)){
            console.log("Object has a field empty")

        }
    }

    const newDispute = new DisputeModel(dispute);
    await newDispute.save();
    res.json(dispute);
});

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
