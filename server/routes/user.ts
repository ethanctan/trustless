import express, { Request, Response } from 'express';
import UserModel from '../models/user/UserModel';
import UserController from '../controllers/userController';
import {RatingModel, ReferralModel} from '../models/user/UserModel';

const router = express.Router()
const userController = new UserController()

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
 * Client-side interface: cookieId, walletId, 
 * randomly-generated referralCode (run get request below first)
 */
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


/**
 * GET request to check if a user with a specific referralCode exists
 * Returns true if there is a user with a valid code, false otherwise
 * @requires req.query to have {referralCode} in the json body
 */
router.get("/checkReferralCode/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    let response = await userController.checkReferralCodeExists(referralCode)
    res.json({referralCodeExists: response})
});

// Works
/**
 * POST request to add a rating to a user's rating mapping
 * Client-side interface: protocolName, rating -> splice to form kv pair
 * Why do we have two post requests for doing basically the exact same thing?
 */
router.post("/addRating/:cookieId/:walletId", async (req: Request, res: Response) => {
    const { cookieId, walletId} = req.params;
    const { protocolName, rating } = req.body;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) 
        return res.status(404).json({ message: 'User not found' });

    const newRating = new RatingModel(rating);
    if (user.protocolRatings.get(protocolName)) 
        return res.status(400).json(
            { message: 'You have already rated this protocol.' });
    user.protocolRatings.set(protocolName, newRating);
    await user.save();

    res.json({ message: 'Rating added successfully' });
});

// POST request to update a rating that already exists in a user's rating mapping
// Client-side interface: protocolName, rating -> splice to form kv pair
// Works
router.post("/updateRating/:cookieId/:walletId", async (req: Request, res: Response) => {
    const { cookieId, walletId} = req.params;
    const { protocolName, rating } = req.body;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) return 
        res.status(404).json({ message: 'User not found' });

    const updatedRating = new RatingModel(rating);
    if (!user.protocolRatings.get(protocolName)) return res.status(404).json({ message: 'Rating not found' });
    user.protocolRatings.set(protocolName, updatedRating);
    await user.save();
    res.json({ message: 'Rating updated successfully' });
});


/**
 * POST request to add a walletaddress:protocol pair to the user's referredUser mapping
 * Returns 404 error if a referral code does not exist
 * Returns 404 error if a user uses its own referral code
 */
router.post("/addReferral/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    const user = await UserModel.findOne({ referralCode: referralCode });
    if (!user) 
        return res.status(404).json({ message: 'No matching referral code found' });
    
    const { walletAddress, referralprotocol } = req.body; 
    const referralProtocolModel = new ReferralModel(referralprotocol);
    // user.referredUsers.set(walletAddress, referralProtocolModel);
    // await user.save();

    res.json({ message: 'Referral added successfully' });
});

// Use cookieId and load user referralCode, ratings, wallet address
// Works
router.get("/getUserInfo/:cookieId", async (req: Request, res: Response) => {
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
router.get("/getRating/:protocolName/:cookieId/:walletId", async (req: Request, res: Response) => {
    const { cookieId, walletId, protocolName } = req.params;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) 
        return res.status(404).json({ message: 'User not found' });

    const rating = user.protocolRatings.get(protocolName);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json(rating.scores);
});


/**
 * GET request to check if a user with a specific cookieId exists
 * @returns false if user does not exist and true otherwise
 */
router.get("/check/:cookieId", async (req, res) => {
    const { cookieId } = req.params;
    const user = await UserModel.findOne({ cookieId: cookieId });
    if (!user) {
      return res.json(false);
    }
    res.json(true);
  });

/**
 * GET request to fetch all the protocol ratings for a given user
 * @returns 404 if user not found. Returns the rating otherwise
 */
router.get('/ratings', async (req, res) => {
    const { cookieId, walletId } = req.query;
    const user = await UserModel.findOne({ cookieId: cookieId, walletId: walletId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ratings = user.protocolRatings;
    res.json(ratings);
});

export default router;

module.exports = router