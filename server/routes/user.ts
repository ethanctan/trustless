import express, { Request, Response } from 'express';
import UserModel from '../models/User';

import mongoose from 'mongoose';
import {RatingModel, ReferralModel} from '../models/User';

const router = express.Router()

/**
 * Get a list of users
 */
router.get("/", async(req: Request, res: Response) => {
    try{
        const users = await UserModel.find({})
        res.json(users)
    }catch(err){
        res.json(err);
    }
});

/**
 * Add user to database
 */
router.post("/", async (req: Request, res: Response) => {


    console.log(req.body)
    let user = req.body

    const newUser = new UserModel();
    const referral = new ReferralModel(user.referredUsers)
    const ratings = new RatingModel(user.userRatings)
    newUser.cookieId = user.cookieId
    newUser.walletId = user.walletId
    newUser.referralCode = user.referralCode
    // newUser.referredUsers.push({referral})
    // newUser.protocolRatings.push({ratings})
    

    console.log("New user: ", newUser)
    await newUser.save();
    res.json()
});

module.exports = router