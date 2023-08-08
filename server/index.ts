import express from 'express';
import mongoose from 'mongoose';


import cors from 'cors';

const app = express();

const userRoute = require('./routes/user')
let protocolExport = require('./routes/protocols')
const protocolsRouter = protocolExport.router
const defiDataRouter = require('./routes/defiData')
const ratingRouter = require('./routes/ratings')
const referralRouter = require('./routes/referrals')
const recaptchaRouter = require('./routes/recaptcha')
const epochCountRouter = require('./routes/epochCount')

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://dyang:RrrwmSWGDb1vqNZy@cluster0.vtkcvkm.mongodb.net/disputeboard?retryWrites=true&w=majority");

app.use("/user", userRoute)
app.use("/defiData", defiDataRouter)
app.use("/protocols", protocolsRouter)
app.use("/ratings", ratingRouter)
app.use("/referrals", referralRouter)
app.use("/recaptcha", recaptchaRouter)
 
app.use("/epochCount", epochCountRouter)

app.listen(3001, () => {
    console.log('server running on port 3001');
});
