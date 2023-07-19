import express, { Request, Response } from 'express';
import UserModel from '../models/user/UserModel';
import UserController from '../controllers/userController';
import {RatingModel, ReferralModel} from '../models/user/UserModel';
import User from '../models/user/User';

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
    let message = await userController.handlePostRequest(User.createUserFromObject(user))
    res.json({message : message})
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


router.get("/getUserInfo/:cookieId", async (req: Request, res: Response) => {
    const { cookieId } = req.params;
    let response = await userController.handleGetUserInfo(cookieId)
    res.status(response.status).json(response.message)
});

router.get("/getRating/:cookieId/:walletId/:protocolName", async (req: Request, res: Response) => {
    const { protocolName, cookieId, walletId } = req.params;
    let response = await userController.handleGetRating(cookieId, walletId, protocolName)
    res.status(response.status).json(response.message)
});


/**
 * GET request to check if a user with a specific cookieId exists
 * @returns false if user does not exist and true otherwise
 */
router.get("/check/:cookieId", async (req, res) => {
    const { cookieId } = req.params;
    let response = await userController.handleCheckUserExists(cookieId)
    res.json(response)
  });

/**
 * GET request to fetch all the protocol ratings for a given user
 * @returns 404 if user not found
 */
router.get('/ratings/:cookieId/:walletId', async (req, res) => {
    const { cookieId, walletId } = req.params;
    let response = await userController.handleGetAllRatings(cookieId, walletId)
    res.status(response.status).json(response.message)
});

export default router;

module.exports = router