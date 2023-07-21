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


router.get("/getUserInfo/:cookieId", async (req: Request, res: Response) => {
    const { cookieId } = req.params;
    let response = await userController.handleGetUserInfo(cookieId)
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


export default router;

module.exports = router