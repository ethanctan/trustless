import express, { Request, Response } from 'express';
import mongoose, { NumberSchemaDefinition } from 'mongoose';
import cors from 'cors';

import DisputeModel from './models/Disputes';
import UserModel from './models/Users';
import ProtocolModel from './models/Protocols';
import IpModel from './models/Ip';
import DataModel from './models/Data';

const app = express();
const axios = require('axios');

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
    try{
        const dispute = req.body;
        if (!(checkScoresCorrect(dispute["qVals"]))){
            res.json({error: "Invalid input"})
            return
        }
        
        const newDispute = new DisputeModel(dispute);
        await newDispute.save();

        res.json(dispute);
    }catch(error){
        // Need to figure out how to handle on the frontend
        res.status(500).json({ message: "An error occurred." });
    }
    
});

function checkScoresCorrect(dispute : [number]){
    for (let i=0; i < dispute.length; i++){
        if (dispute[i] > 10 || dispute[i] < 1){
            return false
        }
    }
    return true
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
    .sort({ averageScore: -1 })
    .then(results => {
        let responseData = results.map(result => ({
            protocolName: result["protocolName"],
            disputeCount: result["disputeCount"],
            averageScore: result["averageScore"]
        }));
        res.json(responseData);
    })
    .catch(err => {
        res.json(err);
    });
});

app.get("/getProtocolsTop", async (req: Request, res: Response) => {
    ProtocolModel.find({})
    .sort({ averageScore: 1 })
    .then(results => {
        let responseData = results.map(result => ({
            protocolName: result["protocolName"],
            disputeCount: result["disputeCount"],
            averageScore: result["averageScore"]
        }));
        res.json(responseData);
    })
    .catch(err => {
        res.json(err);
    });
});


/**
 * Updates document based on new q score
 */
function updateDoc(doc : any, protocol : object){
    var newQScores = [0, 0, 0, 0, 0]
    // element-wise sum on old q scores and incoming scores
    newQScores =  protocol["qScores"].map(function (num : number, idx : number) {
        return num + doc["qScores"][idx];
    })
    // use updated q scores to recompute average
    let newAvg = (newQScores.reduce(
        (partialSum : number, a: number) => 
        partialSum + a, 0))/((doc["disputeCount"])*5)

    doc["disputeCount"] += 1
    doc["protocolName"] = protocol["protocolName"]
    doc["averageScore"] = newAvg
    doc["qScores"] = newQScores
    doc.save()
}


app.post("/addProtocol", async (req: Request, res: Response) => {
    try {
        const protocol = req.body;
        if (!checkScoresCorrect(protocol["qScores"])){
            res.json({error:"Invalid input"});
            return
        }
        await ProtocolModel.findOne(
            {protocolName: protocol["protocolName"]},
        ).then((doc : any)=>{
            // Check if doc is null
            if (!doc){
                const newProtocol = new ProtocolModel(protocol);
                newProtocol.save();
                return
            }

            updateDoc(doc, protocol)
        })

        res.json(protocol);
    } catch (error) {
         // should handle this error
        res.status(500).json({ message: "An error occurred." });
    }
});

app.get('/get-ip', function(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    res.send(ip);
});

app.post("/addIp", async (req: Request, res: Response) => {
    console.log("add Ip",req.body);  // Log the request body
    try {
        
        const ip = req.body;
        await IpModel.findOne(
            {ipAddress: ip["ipAddress"]},
        ).then(async (doc : any)=>{
            // Check if doc is null
            if (!doc){
                const newIp = new IpModel(ip);
                newIp.interacted.push(ip.protocolName);
                await newIp.save();
                return
            }
            else{
                doc.within = false;
                doc.protocolName = ip.protocolName;
                doc.within = doc.interacted.includes(ip.protocolName);
                if (!doc.within) {
                    // User hasn't interacted with this protocol yet, add it to the list.
                    doc.interacted.push(ip.protocolName);
                }
                await doc.save();
            }    
    })
        res.json(ip);
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).json({ message: "An error occurred." });
    }
});

app.get("/getIpWithin", (req: Request, res: Response) => {
    const ipAddress = req.query.ip;
    IpModel.findOne({ipAddress: ipAddress})
    .then(result => {
        res.json(result?.within);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});


app.get('/api/cryptocurrency', async (req, res) => {
    try {
      const response = await axios.get('https://api.llama.fi/protocols');
      if (response) {
        res.json(response.data);
      }
    } catch(ex) {
      console.log(ex);
      res.status(500).send('Error retrieving cryptocurrency data');
    }
  });


app.get("/getDefiData", (req: Request, res: Response) => {
    DataModel.find({})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json(err);
    });
});

app.listen(3001, () => {
    console.log('server running on port 3001');
});
