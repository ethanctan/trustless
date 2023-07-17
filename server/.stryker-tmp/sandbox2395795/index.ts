// @ts-nocheck
import express, { Request, Response } from 'express';
import mongoose, { NumberSchemaDefinition } from 'mongoose';


import cors from 'cors';

const app = express();

const userRoute = require('./routes/user')
let protocolExport = require('./routes/protocols')
const protocolsRouter = protocolExport.router
const ipRouter = require('./routes/ip')
const defiDataRouter = require('./routes/defiData')

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://dyang:RrrwmSWGDb1vqNZy@cluster0.vtkcvkm.mongodb.net/disputeboard?retryWrites=true&w=majority");

app.use("/user", userRoute)

app.use("/ip", ipRouter)
app.use("/defiData", defiDataRouter)
app.use("/protocols", protocolsRouter)

app.listen(3001, () => {
    console.log('server running on port 3001');
});
