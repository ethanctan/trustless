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
// Client-side interface: cookieId, walletId, randomly-generated referralCode (run get request below first)
// works
async function generateCode(codeLength = 8) : Promise<string> {
    const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let code = ""
    let existence : any = true
    while (existence){
        for (let i=0; i < codeLength; i++){
            code += str.charAt(Math.floor(Math.random() * (str.length+1)));
        }
        existence = await UserModel.exists({referralCode : code})
    }
    return code
}



router.post("/", async (req: Request, res: Response) => {
    const user = req.body;
  
    // Find existing user by cookieId or walletId
    const existingUserByCookie = await UserModel.findOne({ cookieId: user.cookieId });
    const existingUserByWallet = await UserModel.findOne({ walletId: user.walletId });
  
    // Case: Nonexistent cookie, identifiable wallet
    if (!existingUserByCookie && existingUserByWallet) {
        existingUserByWallet.cookieId = user.cookieId;
        await existingUserByWallet.save();
        return res.json({ message: 'Cookie reassigned successfully', user: existingUserByWallet });
    }

    // Case: Existent cookie, non identifiable wallet
    if (existingUserByCookie && !existingUserByWallet) {
        return res.status(400).json({ message: 'Please switch to your previous wallet' });
    }

    // Case: Wrong cookie-wallet pair
    if ((existingUserByCookie && existingUserByWallet) && (existingUserByCookie.id !== existingUserByWallet.id)) {
        return res.status(400).json({ message: 'Wrong cookie-wallet pair. Please use another wallet or clear cookies.' });
    }

    // Case: Existent cookie, identifiable wallet - right cookie-wallet pair
    if (existingUserByCookie && existingUserByWallet && existingUserByCookie.id === existingUserByWallet.id) {
        return res.json({ message: 'User already created', user: existingUserByCookie});
    }
    // Case:  Nonexistent cookie, nonexistent wallet
    if (!existingUserByCookie && !existingUserByWallet) {
        const newUser = new UserModel({
            cookieId: user.cookieId,
            walletId: user.walletId,
            referralCode: user.referralCode,
            referredUsers: new Map(),
            protocolRatings: new Map()
        });

        console.log("New user: ", newUser);
        await newUser.save();
        return res.json({ message: 'User added successfully', user: newUser });
    }
});



// GET request to check if a user with a specific referralCode exists
// works
router.get("/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    const user = await UserModel.findOne({ referralCode: referralCode });
    if (!user) {
        return res.json(false);
    }
    res.json(true);
});


// POST request to add a rating to a user's rating mapping
// Client-side interface: protocolName, rating -> splice to form kv pair
// Works
router.post("/:cookieId/:walletId/addRating", async (req: Request, res: Response) => {
    const { cookieId, walletId} = req.params;
    const { protocolName, rating } = req.body;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newRating = new RatingModel(rating);
    user.protocolRatings.set(protocolName, newRating);
    await user.save();

    res.json({ message: 'Rating added successfully' });
});

// POST request to update a rating that already exists in a user's rating mapping
// Client-side interface: protocolName, rating -> splice to form kv pair
// Works
router.post("/:cookieId/:walletId/updateRating", async (req: Request, res: Response) => {
    const { cookieId, walletId} = req.params;
    const { protocolName, rating } = req.body;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedRating = new RatingModel(rating);
    if (!user.protocolRatings.get(protocolName)) return res.status(404).json({ message: 'Rating not found' });
    user.protocolRatings.set(protocolName, updatedRating);
    await user.save();
    console.log("Success");
    res.json({ message: 'Rating updated successfully' });
});

// POST request to add a walletaddress:protocol pair to the user's referredUser mapping
// Client-side interface: walletAddress, referral -> splice to form kv pair
// Works
router.post("/:cookieId/:walletId/addReferral", async (req: Request, res: Response) => {
    const { cookieId, walletId } = req.params;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const walletAddress = req.body.walletAddress;
    const referral = new ReferralModel(req.body.referral);
    user.referredUsers.set(walletAddress, referral);
    await user.save();

    res.json({ message: 'Referral added successfully' });
});

// Use cookieId and load user referralCode, ratings, wallet address
// Works
router.get("/:cookieId/:walletId/getRatings", async (req: Request, res: Response) => {
    const { cookieId, walletId } = req.params;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.protocolRatings);
});

export default router;

module.exports = router