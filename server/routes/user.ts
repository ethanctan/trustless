/** Express router providing user related routes. Under /user
 * @module routers/users
 * @requires express
 */

/**
 * express module
 * @const
 */
import express, { Request, Response } from 'express';
import UserModel from '../models/user/UserModel';
import UserController from '../controllers/userController';
import User from '../models/user/User';
import { json } from 'stream/consumers';

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
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
 * Post request to add user to the database
 * @param {string} cookieId - cookieId of user
 * @param {string} walletId - cookieId of user
 * @param {string} referralCode - cookieId of user
 * @param {string} numReferredUsers - number of referred users
 * @param {object} protocolRatings - protocolRatings that map strings to {scores, referral}
 * @returns message indicating success or failure, see userController for more details
 */
router.post("/", async (req: Request, res: Response) => {
    const user = req.body;
    let message = await userController.handlePostRequest(User.createUserFromObject(user))
    res.json({message : message})
});


router.get("/getUserInfo/:walletId", async (req: Request, res: Response) => {
    const { walletId } = req.params;
    let response = await userController.handleGetUserInfo(walletId)
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
 * GET request to get all user addresses
 * @returns list of all user addresses
 */
router.get("/getAllUserAddresses", async (req, res) => {
    let response = await userController.getAllUsers()
    res.json(response)
});

/**
 * GET request to get all user addresses and their referral counts
 * @returns list of key:value pairs of user addresses:referral counts
 */
router.get("/getAllReferralCounts", async (req, res) => {
    let response = await userController.getAllReferrals()
    res.json(response)
})

export default router;

module.exports = router