import express, { Request, Response } from 'express';
import UserModel from '../models/user/UserModel';
import { ReferralModel } from '../models/user/UserModel';
import User from '../models/user/User';
import ReferralController from '../controllers/referralController';
const router = express.Router()
const userController = new ReferralController()



/**
 * POST request to add a walletaddress:protocol pair to the user's referredUser mapping
 * Returns 404 error if a referral code does not exist
 * Returns 404 error if a user uses its own referral code
 */
router.post("/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    const user = await UserModel.findOne({ referralCode: referralCode });
    if (!user) 
        return res.status(404).json({ message: 'No matching referral code found' });
    userController.addReferral(User.createUserFromDocument(user), referralCode)
    // const { walletAddress, referralprotocol } = req.body; 
    // const referralProtocolModel = new ReferralModel(referralprotocol);
    // // user.referredUsers.set(walletAddress, referralProtocolModel);
    // // await user.save();

    // res.json({ message: 'Referral added successfully' });
});

/**
 * GET request to check if a user with a specific referralCode exists
 * Returns true if there is a user with a valid code, false otherwise
 * @requires req.query to have {referralCode} in the json body
 */
router.get("/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    let response = await userController.checkReferralCodeExists(referralCode)
    res.json({referralCodeExists: response})
});

export default router;

module.exports = router