import express, { Request, Response } from 'express';
import mongoose, { NumberSchemaDefinition } from 'mongoose';
import cors from 'cors';

import DisputeModel from './models/Disputes';

import ProtocolModel from './models/Protocols';
import IpModel from './models/Ip';
import DataModel from './models/Data';



const app = express();
const axios = require('axios');

const userRoute = require('./routes/users')
const disputeRoute = require('./routes/disputes')
const protocolsRoute = require('./routes/protocols')

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://dyang:RrrwmSWGDb1vqNZy@cluster0.vtkcvkm.mongodb.net/disputeboard?retryWrites=true&w=majority");

app.use("/users", userRoute)
app.use("/disputes", disputeRoute)
app.use("/protocols", protocolsRoute)




app.get('/get-ip', function(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    res.send(ip);
});

app.post("/addIp", async (req: Request, res: Response) => {
    // console.log("add Ip",req.body);  // Log the request body
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
    //   console.log(ex);
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
