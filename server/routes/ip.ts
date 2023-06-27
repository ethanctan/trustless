import express, { Request, Response } from 'express';
import IpModel from '../models/Ip';

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
    // console.log("add Ip",req.body);  // Log the request body
    try {
        const clientIp = req.body
        const doc = await IpModel.findOne({ipAddress: clientIp["ipAddress"]})
        await saveIp(doc, clientIp)
        res.json(clientIp);
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).json({ message: "An error occurred." });
    }
});

async function saveIp(doc : any, ip : any){
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
}

router.get("/", (req: Request, res: Response) => {
    const ipAddress = req.query.ip;
    
    IpModel.findOne({ipAddress: ipAddress})
    .then(result => {
        res.json(result?.within);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

router.get('/getClientIp', function(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    res.send(ip);
});

module.exports = router
