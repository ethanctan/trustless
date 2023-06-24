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

    if (!(checkDisputeCorrect)){
        res.json({error: "Invalid input"})
        return
    }

    await ProtocolModel.find(
        {protocolAddress: dispute["protocol"]},
    ).then((doc)=>{
        var totalScore = computeAverage(doc, dispute)
        
        ProtocolModel.updateOne(
            {protocolAddress: dispute["protocol"]}, 
            {$inc:{
                disputeCount: 1, 
                q1Score: dispute["question1"],
                q2Score: dispute["question2"],
                q3Score: dispute["question3"],
                q4Score: dispute["question4"],
                q5Score: dispute["question5"]
            }, $set: {
                averageScore: totalScore
            }},
            {upsert: true}
        );
    })

    const newDispute = new DisputeModel(dispute);
    await newDispute.save();

    res.json(dispute);
});

function checkDisputeCorrect(dispute : object){
    let protocolCorrect = validHex(dispute["protocol"]);
    let q1Correct = (dispute["question1"] <= 10 && dispute["question1"] >= 1)
    let q2Correct = (dispute["question2"] <= 10 && dispute["question2"] >= 1)
    let q3Correct = (dispute["question3"] <= 10 && dispute["question3"] >= 1)
    let q4Correct = (dispute["question4"] <= 10 && dispute["question4"] >= 1)
    let q5Correct = (dispute["question5"] <= 10 && dispute["question5"] >= 1)
    let qsCorrect = q1Correct && q2Correct && q3Correct && q4Correct && q5Correct
    return protocolCorrect && qsCorrect
}

function computeAverage(doc : object, dispute: object){
    var newTotScore = 0
    var cnt = 0
    var totalScore = 0
    if (doc["averageScore"]){
        let score = doc["averageScore"]
        let cnt = doc["disputeCount"]
        totalScore = score * cnt 
    }
    let avgScore = (dispute["question1"] + dispute["question2"] +
    dispute["question3"] + dispute["question4"] + dispute["question5"])/5
    newTotScore = (totalScore+avgScore)/(cnt+1)
    return newTotScore
}


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
    await newUser.save();
    res.json(user);
});

app.get("/getProtocols", async (req: Request, res: Response) => {
    ProtocolModel.find({})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json(err);
    });
});

app.post("/addProtocol", async (req: Request, res: Response) => {
    console.log(req.body);  // Log the request body
    try {
        const protocol = req.body;
        const newProtocol = new ProtocolModel(protocol);
        await newProtocol.save();
        res.json(protocol);
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).json({ message: "An error occurred." });
    }
});

  



app.listen(3001, () => {
    console.log('server running on port 3001');
});
