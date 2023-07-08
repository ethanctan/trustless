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
    let existence = true
    while (existence){
        for (let i=0; i < codeLength; i++){
            code += str.charAt(Math.floor(Math.random() * (str.length+1)));
        }
        existence = !!(await UserModel.exists({referralCode : code}))
    }
    return code
}



router.post("/", async (req: Request, res: Response) => {
    const user = req.body;
  
    // Find existing user by cookieId or walletId
    const userCookie = await UserModel.findOne({ cookieId: user.cookieId });
    const userWallet = await UserModel.findOne({ walletId: user.walletId });

    // Case: Nonexistent cookie, identifiable wallet
    if (!userCookie && userWallet) {
        userWallet.cookieId = user.cookieId;
        await userWallet.save();
        return res.json({ message: 'Cookie reassigned successfully', user: userWallet });
    }

    // Case: Existent cookie, non identifiable wallet
    if (userCookie && !userWallet) {
        return res.status(400).json({ message: 'Please switch to your previous wallet' });
    }

    // Case: Wrong cookie-wallet pair
    if ((userCookie && userWallet) && (userCookie.id !== userWallet.id)) {
        return res.status(400).json({ message: 'Wrong cookie-wallet pair. Please use another wallet or clear cookies.' });
    }

    // Case: Existent cookie, identifiable wallet - right cookie-wallet pair
    if (userCookie && userWallet && userCookie.id === userWallet.id) {
        return res.json({ message: 'User already created', user: userCookie});
    }
    // Case:  Nonexistent cookie, nonexistent wallet
    if (!userCookie && !userWallet) {
        const newUser = new UserModel({
            cookieId: user.cookieId,
            walletId: user.walletId,
            referralCode: user.referralCode,
            referredUsers: new Map(),
            protocolRatings: new Map()
        });
        await newUser.save();
        return res.json({ message: 'User added successfully', user: newUser });
    }
});



// GET request to check if a user with a specific referralCode exists
// works
router.get("/checkReferralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.query;
    
    // If referralCode is null or undefined, return true immediately
    if (referralCode === null || referralCode === undefined) {
        return res.json(true);
    }

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
    if (user.protocolRatings.get(protocolName)) return res.status(400).json({ message: 'You have already rated this protocol.' });
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
router.post("/:referralCode/addReferral", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    const user = await UserModel.findOne({ referralCode: referralCode });
    if (!user) return res.status(404).json({ message: 'No matching referral code found' });
    
    const { walletAddress, referralprotocol } = req.body;  
    console.log(req.body);
    const referralProtocolModel = new ReferralModel(referralprotocol);

    user.referredUsers.set(walletAddress, referralProtocolModel);
    await user.save();

    res.json({ message: 'Referral added successfully' });
});

// Use cookieId and load user referralCode, ratings, wallet address
// Works
router.get("/:cookieId/getUserInfo", async (req: Request, res: Response) => {
    const { cookieId } = req.params;
    const user = await UserModel.findOne({ cookieId: cookieId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create an object with the properties you want to return
    const userInfo = {
        walletId: user.walletId,
        referralCode: user.referralCode,
        protocolRatings: user.protocolRatings
    };

    res.json(userInfo);
});

// Use cookieId, walletId to get latest rating for a specific protocol
// Works
router.get("/:cookieId/:walletId/getRating/:protocolName", async (req: Request, res: Response) => {
    const { cookieId, walletId, protocolName } = req.params;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rating = user.protocolRatings.get(protocolName);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json(rating.scores);
});

// GET request to check if a user with a specific cookieId exists
// works
router.get("/check/:cookieId", async (req, res) => {
    console.log("Checking user cookie")
    const { cookieId } = req.params;
    const user = await UserModel.findOne({ cookieId: cookieId });
    if (!user) {
      return res.json(false);
    }
    res.json(true);
  });

// GET request to fetch all the protocol ratings for a given user
// Works
router.get('/ratings', async (req, res) => {
    const { cookieId, walletId } = req.query;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ratings = user.protocolRatings;
    res.json(ratings);
});

export default router;

module.exports = router